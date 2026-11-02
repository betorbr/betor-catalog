import fs from 'fs'
import { Eleventy } from '@11ty/eleventy'
import PQueue from 'p-queue'

const ITEMS_PATH = 'src/_data/items.json'
const MOVIES_PATH = 'src/_data/movies.json'
const TVS_PATH = 'src/_data/tvs.json'
const CATALOG_PATH = 'src/_data/catalog.json'
const CATALOG_MOVIES_PATH = 'src/_data/catalogMovies.json'
const CATALOG_TVS_PATH = 'src/_data/catalogTvs.json'
const CATALOG_TVS_BY_SEASON_PATH = 'src/_data/catalogTvsBySeason.json'
const SEARCH_CATALOG_PATH = 'src/_data/searchCatalog.json'

class BetorCatalog {
  constructor (options) {
    this.options = options
    this.itMdbApiQueue = new PQueue({ intervalCap: 20, interval: 3000 })
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

  sanitizeItemFields (item) {
    const { torrent_failure_days: _unusedFailureDays, ...sanitizedItem } = item
    return sanitizedItem
  }

  /*
    it-mdb-api
  */

  async getInfoFromItMdbApi (itemType, imdbId) {
    const endpoint = itemType === 'movie' ? 'movies' : 'tvshows'
    const url = `https://it-mdb-api.dgls.me/v1/${endpoint}/${imdbId}?language=pt-BR&timeout=60`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }
    const res = await this.itMdbApiQueue.add(() => {
      console.log(`fetching from it-mdb-api imdb_id:${imdbId} data: ${url}`)
      return fetch(url, options)
    })
    if (!res.ok) {
      throw new Error(`Error to fetch ${url}: ${res.status}`)
    }
    return res.json()
  }

  /*
    Enrich catalog items
  */

  async enrichCatalogItems (catalogItems) {
    return Promise.all(catalogItems.map(item => (this.enrichCatalogItem(item))))
  }

  async enrichCatalogItem (catalogItem) {
    if (catalogItem.imdb_id) {
      try {
        const info = await this.getInfoFromItMdbApi(catalogItem.item_type, catalogItem.imdb_id)
        if (info) {
          const yearStr = info.year ? String(info.year) : null
          const normalizedInfo = {
            title: info.title,
            original_title: info.original_title,
            overview: info.overview,
            poster_path: info.tmdb_poster_path,
            backdrop_path: info.tmdb_backdrop_path,
            release_date: yearStr,
            first_air_date: yearStr,
            imdb_id: info.imdb_id || catalogItem.imdb_id,
            tmdb_id: info.tmdb_id || catalogItem.tmdb_id
          }
          return { ...normalizedInfo, ...catalogItem }
        } else {
          console.warn(`No info found at it-mdb-api for item ${catalogItem.imdb_id}`)
        }
      } catch (err) {
        console.warn(`Failed to enrich item ${catalogItem.imdb_id}: ${err.message}`)
        return catalogItem
      }
    }
    return catalogItem
  }

  compactCatalogItemForSearch (catalogItem) {
    return {
      t: catalogItem.title || catalogItem.name,
      ot: catalogItem.original_title,
      n: catalogItem.name,
      on: catalogItem.original_name,
      rd: catalogItem.release_date || catalogItem.first_air_date,
      ii: catalogItem.imdb_id,
      ti: catalogItem.tmdb_id,
      bp: catalogItem.backdrop_path,
      pp: catalogItem.poster_path,
      it: catalogItem.item_type,
      as: catalogItem.available_seasons === undefined ? null : catalogItem.available_seasons,
      items: catalogItem.items.map((item) => ({
        id: item.id,
        it: item.item_type,
        ii: item.imdb_id,
        ti: item.tmdb_id,
        pu: item.provider_url,
        ps: item.provider_slug,
        du: item.download_url,
        tn: item.torrent_name,
        md: item.magnet_dn,
        mx: item.magnet_xt,
        mu: item.magnet_uri,
        lg: item.languages || [],
        sz: item.torrent_size,
        fs: item.torrent_files,
        np: item.torrent_num_peers,
        ns: item.torrent_num_seeds,
        td: item.torrent_is_dying,
        tx: item.torrent_is_dead,
        ss: item.seasons,
        ua: item.updated_at,
        ia: item.inserted_at
      }))
    }
  }

  /*
    Data: Fetch Items
  */

  async dataFetchItems () {
    console.log('fetching items from Betor API...')

    const url = this.options.downloadItemsUrl || 'https://v1.betor.top/download-items/'
    const res = await fetch(url)

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
    const validItems = items.filter(item => (
      item.imdb_id != null &&
      item.item_type != null &&
      item.magnet_uri != null &&
      item.torrent_size != null
    )).map(item => this.sanitizeItemFields(item))
    console.log(`${validItems.length} valid items`)
    const sortedItems = validItems.sort((a, b) => new Date(b.inserted_at) - new Date(a.inserted_at))

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

    const sanitizedItems = items.map(item => this.sanitizeItemFields(item))

    const baseValidItems = sanitizedItems.filter(item => (
      item.item_type != null &&
      item.updated_at != null &&
      item.imdb_id != null &&
      item.tmdb_id != null
    ))

    if (this.options.excludeDeadTorrents) {
      const excludedDeadTorrentsCount = baseValidItems.filter(item => item.torrent_is_dead === true).length
      console.log(`excluding ${excludedDeadTorrentsCount} dead torrents (--exclude-dead-torrents)`)
    }

    const validItems = baseValidItems.filter(item => (
      (!this.options.excludeDeadTorrents || item.torrent_is_dead !== true)
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

    const searchCatalogItems = catalogItems.map(item => this.compactCatalogItemForSearch(item))
    this.write(SEARCH_CATALOG_PATH, searchCatalogItems)
    console.log(`search catalog data written to file: ${SEARCH_CATALOG_PATH}`)

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
