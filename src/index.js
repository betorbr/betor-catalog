import fs from 'fs'
import { Eleventy } from '@11ty/eleventy'
import PQueue from 'p-queue'

const ITEMS_PATH = 'src/_data/items.json'
const RAW_ITEMS_PATH = 'src/_data/rawItems.json'
const MOVIES_PATH = 'src/_data/movies.json'
const TVS_PATH = 'src/_data/tvs.json'
const ITEMS_GROUP_BY_IMDB_ID_PATH = 'src/_data/itemsByImdbId.json'
const ITEMS_GROUP_BY_IMDB_ID_AND_SEASON_PATH = 'src/_data/itemsByImdbIdAndSeason.json'

class BetorCatalog {
  constructor (options) {
    this.options = options
    this.env = {
      tmdbApiKey: process.env.TMDB_API_KEY
    }
    this.tmdbApiQueue = new PQueue({ intervalCap: 2, interval: 1000 })
  }

  async buildItems () {
    console.log('building items data...')

    const rawItems = await this.fetchRawItems()
    console.log(`${rawItems.length} raw items found`)
    this.write(RAW_ITEMS_PATH, rawItems)

    const catalogItems = this.buildCatalogItems(rawItems)
    console.log(`${catalogItems.length} catalog items generated`)

    const enrichedItems = await this.enrichItems(catalogItems)
    console.log('catalog items enriched with TMDB metadata')

    this.write(ITEMS_PATH, enrichedItems)
    this.write(MOVIES_PATH, enrichedItems.filter(({ item_type: itemType }) => (itemType === 'movie')))
    this.write(TVS_PATH, enrichedItems.filter(({ item_type: itemType }) => (itemType === 'tv')))
    const itemsByImdb = await this.groupBy(enrichedItems, 'imdb_id')
    this.write(ITEMS_GROUP_BY_IMDB_ID_PATH, itemsByImdb)
    const itemsByImdbAndSeason = await this.groupBySeason(enrichedItems, 'imdb_id')
    this.write(ITEMS_GROUP_BY_IMDB_ID_AND_SEASON_PATH, itemsByImdbAndSeason)
  }

  async enrichItems (items) {
    return Promise.all(items.map(item => (this.enrichItem(item))))
  }

  async enrichItem (item) {
    const infoCache = this.getInfoCache(item.imdb_id)
    if (infoCache) {
      console.info(`Item info loaded from cache ${item.imdb_id}`)
      return { ...item, info: infoCache }
    }
    if (item.imdb_id) {
      try {
        const itemInfo = await this.getItemInfoFromImdb(item)
        this.setInfoCache(item.imdb_id, itemInfo)
        return { ...item, info: itemInfo }
      } catch (err) {
        console.warn(`Failed to enrich item ${item.imdb_id}: ${err.message}`)
        return item
      }
    }
    return item
  }

  async fetchRawItems (page = 1, attempt = 1, items = []) {
    const url = `${this.options.betorApiUrl}/v1/items/?sort=-inserted_at&size=100&page=${page}`
    console.log(`fetching items page ${page}: ${url}`)
    const res = await fetch(url, {
      headers: this.options.betorApiAuthorization ? { Authorization: `Basic ${this.options.betorApiAuthorization}` } : {}
    })
    if (!res.ok) {
      if (attempt <= 5) {
        console.warn(`Error to fetch page ${page}: ${res.status}, retrying... (attempt ${attempt})`)
        return this.fetchRawItems(page, attempt + 1, items)
      }
      throw new Error(`Error to fetch page ${page}: ${res.status}`)
    }
    const data = await res.json()
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Unexpected body!')
    }
    const newItems = [...items, ...data.items]
    if (page >= data.pages) {
      return newItems
    }
    if (this.options.pagesLimit && page >= this.options.pagesLimit) {
      console.log(`Reached page limit of ${this.options.pagesLimit} pages`)
      return newItems
    }
    return this.fetchRawItems(page + 1, 1, newItems)
  }

  buildCatalogItems (rawItems) {
    const filteredItems = rawItems.filter(item => (
      item.item_type != null &&
      item.updated_at != null &&
      item.imdb_id != null &&
      item.tmdb_id != null
    ))

    const providerGroups = {}
    filteredItems.forEach(item => {
      const providerKey = [
        item.item_type,
        item.imdb_id,
        item.tmdb_id,
        item.provider_slug,
        item.provider_url
      ].join('|')

      if (!providerGroups[providerKey]) {
        providerGroups[providerKey] = {
          item_type: item.item_type,
          imdb_id: item.imdb_id,
          tmdb_id: item.tmdb_id,
          provider_slug: item.provider_slug,
          provider_url: item.provider_url,
          last_updated: item.updated_at,
          torrents: []
        }
      }

      const providerGroup = providerGroups[providerKey]
      if (providerGroup.last_updated < item.updated_at) {
        providerGroup.last_updated = item.updated_at
      }

      providerGroup.torrents.push({
        magnet_uri: item.magnet_uri,
        languages: item.languages,
        torrent_name: item.torrent_name ?? item.magnet_dn,
        torrent_size: item.torrent_size,
        torrent_files: item.torrent_files,
        download_path: item.download_path,
        torrent_num_peers: item.torrent_num_peers,
        torrent_num_seeds: item.torrent_num_seeds,
        seasons: item.seasons,
        inserted_at: item.inserted_at
      })
    })

    const catalogGroups = {}
    Object.values(providerGroups).forEach(providerGroup => {
      const catalogKey = [
        providerGroup.item_type,
        providerGroup.imdb_id,
        providerGroup.tmdb_id
      ].join('|')

      if (!catalogGroups[catalogKey]) {
        catalogGroups[catalogKey] = {
          item_type: providerGroup.item_type,
          imdb_id: providerGroup.imdb_id,
          tmdb_id: providerGroup.tmdb_id,
          last_updated: providerGroup.last_updated,
          providers: []
        }
      }

      const catalogGroup = catalogGroups[catalogKey]
      if (catalogGroup.last_updated < providerGroup.last_updated) {
        catalogGroup.last_updated = providerGroup.last_updated
      }

      catalogGroup.providers.push({
        slug: providerGroup.provider_slug,
        url: providerGroup.provider_url,
        torrents: providerGroup.torrents
      })
    })

    return Object.values(catalogGroups)
  }

  getInfoCache (imdbId) {
    try {
      const cacheValue = fs.readFileSync(`.cache/info-${imdbId}.json`)
      return JSON.parse(cacheValue)
    } catch (err) {
      return null
    }
  }

  setInfoCache (imdbId, itemInfo) {
    try {
      const cacheDir = '.cache'
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }
      this.write(`.cache/info-${imdbId}.json`, itemInfo)
      console.info(`${imdbId} cached!`)
    } catch (err) {
      console.debug(`Fail to cache item info ${imdbId}`)
    }
  }

  async getItemInfoFromImdb (item) {
    if (!this.env.tmdbApiKey) {
      throw new Error('TMDB_API_KEY environment variable is not set')
    }
    const url = `https://api.themoviedb.org/3/find/${item.imdb_id}?external_source=imdb_id&language=pt-BR`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.env.tmdbApiKey}`
      }
    }
    const res = await this.tmdbApiQueue.add(() => {
      console.log(`fetching from tmdb imdb_id:${item.imdb_id} data: ${url}`)
      return fetch(url, options)
    })
    if (!res.ok) {
      throw new Error(`Error to fetch ${url}: ${res.status}`)
    }
    const findData = await res.json()
    if (item.item_type === 'movie' && !findData.movie_results) {
      throw new Error(`Movie not found at TMDB with imdb_id ${item.imdb_id}`)
    }
    if (item.item_type === 'tv' && !findData.tv_results) {
      throw new Error(`TV Show not found at TMDB with imdb_id ${item.imdb_id}`)
    }
    return (item.item_type === 'movie' && findData.movie_results[0]) || (item.item_type === 'tv' && findData.tv_results[0])
  }

  groupBy (items, attr) {
    const groups = {}
    items.forEach(item => {
      if (!Object.keys(groups).includes(item[attr])) {
        groups[item[attr]] = []
      }
      groups[item[attr]].push(item)
    })
    return Object.keys(groups).map(k => ({ key: k, items: groups[k] }))
  }

  itemSeason (item, season) {
    const newItem = structuredClone(item)
    newItem.providers = newItem.providers
      .map(provider => ({
        ...provider,
        torrents: provider.torrents.filter(t => t.seasons.includes(season))
      }))
      .filter(provider => provider.torrents.length > 0)
    return newItem
  }

  groupBySeason (items, attr) {
    const groups = {}
    items.forEach(item => {
      const seasons = [
        ...new Set(item.providers.flatMap(p => p.torrents).flatMap(t => t.seasons))
      ]
      seasons.forEach(season => {
        const key = [item[attr], season].join('|')
        if (!Object.keys(groups).includes(key)) {
          groups[key] = []
        }
        groups[key].push(this.itemSeason(item, season))
      })
    })
    return Object.keys(groups).map(v => {
      const [k, season] = v.split('|', 2)
      return { key: k, season, items: groups[v] }
    })
  }

  write (path, data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
  }

  async serve () {
    const elev = new Eleventy()
    await elev.init()
    await elev.watch()
    await elev.serve()
  }

  async build () {
    const elev = new Eleventy()
    await elev.init()
    await elev.write()
  }
}

export default BetorCatalog
