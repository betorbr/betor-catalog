import renderCatalog from './render/pages/catalog.js'

export default class CatalogMovies {
  data () {
    return {
      pagination: {
        data: 'catalogMovies',
        size: 40,
        alias: 'item'
      },
      permalink: ({ pagination }) => {
        if (pagination.pageNumber > 0) {
          return `catalogo/filmes/${pagination.pageNumber + 1}/index.html`
        }
        return 'catalogo/filmes/index.html'
      }
    }
  }

  render ({ pagination }) {
    return renderCatalog(pagination, 'Catálogo de Filmes - Catálogo BeTor')
  }
}
