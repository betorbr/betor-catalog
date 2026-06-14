import renderCatalogItem from './render/pages/catalogItem.js'

export default class CatalogItem {
  data () {
    return {
      pagination: {
        data: 'catalog',
        size: 1,
        alias: 'item'
      },
      permalink: ({ item }) => (`imdb/${item.imdb_id}/index.html`)
    }
  }

  render ({ item }) {
    return renderCatalogItem(item)
  }
}
