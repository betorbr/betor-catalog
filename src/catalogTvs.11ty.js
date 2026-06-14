import renderCatalog from './render/pages/catalog.js'

export default class CatalogTvs {
  data () {
    return {
      pagination: {
        data: 'catalogTvs',
        size: 40,
        alias: 'item'
      },
      permalink: ({ pagination }) => {
        if (pagination.pageNumber > 0) {
          return `catalogo/series/${pagination.pageNumber + 1}/index.html`
        }
        return 'catalogo/series/index.html'
      }
    }
  }

  render ({ pagination }) {
    return renderCatalog(pagination, 'Catálogo de Séries - Catálogo BeTor')
  }
}
