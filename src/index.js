import fs from 'fs'
import { Eleventy } from '@11ty/eleventy'
import PQueue from 'p-queue'

const CACHE_DIR = '.cache'

const ITEMS_PATH = 'src/_data/items.json'
const MOVIES_PATH = 'src/_data/movies.json'
const TVS_PATH = 'src/_data/tvs.json'
const CATALOG_PATH = 'src/_data/catalog.json'
const CATALOG_MOVIES_PATH = 'src/_data/catalogMovies.json'
const CATALOG_TVS_PATH = 'src/_data/catalogTvs.json'
const CATALOG_TVS_BY_SEASON_PATH = 'src/_data/catalogTvsBySeason.json'

class BetorCatalog {
  constructor (options) {
    this.options = options
    this.env = {
      tmdbApiKey: process.env.TMDB_API_KEY
    }
    this.tmdbApiQueue = new PQueue({ intervalCap: 2, interval: 1000 })
  }

  /*
    IO Utils
  */

  read (path) {
    const data = fs.readFileSync(path, 'utf-8')
    return JSON.parse(data)
  }

  write (path, data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
  }

  /*
    Cache Utils
  */

  getInfoCache (imdbId) {
    try {
      const cacheValue = fs.readFileSync(`${CACHE_DIR}/info-${imdbId}.json`)
      return JSON.parse(cacheValue)
    } catch (err) {
      return null
    }
  }

  setInfoCache (imdbId, info) {
    try {
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true })
      }
      this.write(`${CACHE_DIR}/info-${imdbId}.json`, info)
      console.info(`${imdbId} cached!`)
    } catch (err) {
      console.error(`fail to cache item info ${imdbId}: ${err.message}`)
    }
  }

  /*
    TMDB API
  */

  async getInfoFromTmdbAPI (itemType, imdbId) {
    if (!this.env.tmdbApiKey) {
      throw new Error('TMDB_API_KEY environment variable is not set')
    }
    const url = `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&language=pt-BR`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.env.tmdbApiKey}`
      }
    }
    const res = await this.tmdbApiQueue.add(() => {
      console.log(`fetching from tmdb imdb_id:${imdbId} data: ${url}`)
      return fetch(url, options)
    })
    if (!res.ok) {
      throw new Error(`Error to fetch ${url}: ${res.status}`)
    }
    const findData = await res.json()
    if (itemType === 'movie' && !findData.movie_results) {
      throw new Error(`Movie not found at TMDB with imdb_id ${imdbId}`)
    }
    if (itemType === 'tv' && !findData.tv_results) {
      throw new Error(`TV Show not found at TMDB with imdb_id ${imdbId}`)
    }
    return (itemType === 'movie' && findData.movie_results[0]) || (itemType === 'tv' && findData.tv_results[0])
  }

  /*
    Enrich catalog items
  */

  async enrichCatalogItems (catalogItems) {
    return Promise.all(catalogItems.map(item => (this.enrichCatalogItem(item))))
  }

  async enrichCatalogItem (catalogItem) {
    const infoCache = this.getInfoCache(catalogItem.imdb_id)
    if (infoCache) {
      console.info(`Item info loaded from cache ${catalogItem.imdb_id}`)
      return { ...infoCache, ...catalogItem }
    }
    if (catalogItem.imdb_id) {
      try {
        const info = await this.getInfoFromTmdbAPI(catalogItem.item_type, catalogItem.imdb_id)
        if (info) {
          this.setInfoCache(catalogItem.imdb_id, info)
        } else {
          console.warn(`No info found at TMDB for item ${catalogItem.imdb_id}`)
        }
        return { ...info, ...catalogItem }
      } catch (err) {
        console.warn(`Failed to enrich item ${catalogItem.imdb_id}: ${err.message}`)
        return catalogItem
      }
    }
    return catalogItem
  }

  /*
    Data: Fetch Items
  */

  async dataFetchItems () {
    console.log('fetching items from Betor API...')

    const url = `${this.options.betorApiUrl}/v1/admin/download-items/`
    const res = await fetch(url, {
      headers: this.options.betorApiAuthorization ? { Authorization: `Basic ${this.options.betorApiAuthorization}` } : {}
    })

    if (!res.ok) {
      throw new Error(`Error requesting items dump: ${res.status}`)
    }

    const data = await res.json()
    if (!data.download_url) {
      throw new Error('download_url missing from items dump response')
    }

    console.log(`download URL received: ${data.download_url}`)

    const itemsDownloadUrlRes = await fetch(data.download_url)
    if (!itemsDownloadUrlRes.ok) {
      throw new Error(`Error downloading items file: ${itemsDownloadUrlRes.status}`)
    }

    const items = await itemsDownloadUrlRes.json()
    console.log(`${Array.isArray(items) ? items.length : 0} items downloaded`)
    const sortedItems = items.sort((a, b) => new Date(b.inserted_at) - new Date(a.inserted_at))

    this.write(ITEMS_PATH, sortedItems)
    console.log(`items fetched and written to file: ${ITEMS_PATH}`)

    const movies = sortedItems.filter(({ item_type: itemType }) => (itemType === 'movie'))
    const tvs = sortedItems.filter(({ item_type: itemType }) => (itemType === 'tv'))

    this.write(MOVIES_PATH, movies)
    console.log(`movies data written to file: ${MOVIES_PATH}`)

    this.write(TVS_PATH, tvs)
    console.log(`tv shows data written to file: ${TVS_PATH}`)
  }

  /*
    Data: Build Catalog Items
  */

  async dataCatalogItems () {
    console.log('building catalog items data...')

    const items = this.read(ITEMS_PATH)
    console.log(`${items.length} items loaded`)

    const validItems = items.filter(item => (
      item.item_type != null &&
      item.updated_at != null &&
      item.imdb_id != null &&
      item.tmdb_id != null
    ))
    console.log(`${validItems.length} valid items`)

    const catalogItemsByImdbId = {}
    validItems.forEach(item => {
      const catalogKey = item.imdb_id
      if (!catalogItemsByImdbId[catalogKey]) {
        catalogItemsByImdbId[catalogKey] = {
          item_type: item.item_type,
          imdb_id: item.imdb_id,
          tmdb_id: item.tmdb_id,
          inserted_at: item.inserted_at,
          last_updated: item.updated_at,
          items: [item]
        }
      } else {
        const catalogItem = catalogItemsByImdbId[catalogKey]
        if (catalogItem.inserted_at > item.inserted_at) {
          catalogItem.inserted_at = item.inserted_at
        }
        if (catalogItem.last_updated < item.updated_at) {
          catalogItem.last_updated = item.updated_at
        }
        catalogItem.items.push(item)
      }
      if (item.item_type === 'tv') {
        if (!catalogItemsByImdbId[catalogKey].available_seasons) {
          catalogItemsByImdbId[catalogKey].available_seasons = []
        }
        catalogItemsByImdbId[catalogKey].available_seasons = new Set(catalogItemsByImdbId[catalogKey].available_seasons.concat(item.seasons)).values().toArray().sort()
      }
    })

    const enrichedCatalogItems = await this.enrichCatalogItems(Object.values(catalogItemsByImdbId))
    const catalogItems = enrichedCatalogItems.filter(item => (item.title || item.name))
    const catalogMoviesItems = catalogItems.filter(({ item_type: itemType }) => (itemType === 'movie'))
    const catalogTvItems = catalogItems.filter(({ item_type: itemType }) => (itemType === 'tv'))
    console.log(`${catalogItems.length} catalog items generated`)

    this.write(CATALOG_PATH, catalogItems)
    console.log(`catalog items built and written to file: ${CATALOG_PATH}`)

    this.write(CATALOG_MOVIES_PATH, catalogMoviesItems)
    console.log(`movies data written to file: ${CATALOG_MOVIES_PATH}`)

    this.write(CATALOG_TVS_PATH, catalogTvItems)
    console.log(`tv shows data written to file: ${CATALOG_TVS_PATH}`)

    const catalogTvItemsBySeason = catalogTvItems.map(item => {
      const seasons = [
        ...new Set(item.items.flatMap(i => i.seasons))
      ]
      return seasons.map(season => ({
        ...item,
        items: item.items.filter((i) => i.seasons.includes(season)),
        season
      }))
    }).flat()
    this.write(CATALOG_TVS_BY_SEASON_PATH, catalogTvItemsBySeason)
    console.log(`tv shows by season data written to file: ${CATALOG_TVS_BY_SEASON_PATH}`)
  }

  /*
    Eleventy
  */

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
