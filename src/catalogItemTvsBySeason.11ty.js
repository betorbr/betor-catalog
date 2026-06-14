import renderCatalogItem from './render/pages/catalogItem.js'

export default class CatalogItemTvsBySeason {
  data () {
    return {
      pagination: {
        data: 'catalogTvsBySeason',
        size: 1,
        alias: 'itemWithSeason'
      },
      permalink: ({ itemWithSeason }) => (`imdb/${itemWithSeason.imdb_id}/season/${itemWithSeason.season}/index.html`)
    }
  }

  render ({ itemWithSeason }) {
    return renderCatalogItem(itemWithSeason)
  }
}
