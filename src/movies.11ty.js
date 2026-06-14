import renderPaginatedPage from './components/pages/paginated.js'

export default class Movies {
  data () {
    return {
      pagination: {
        data: 'movies',
        size: 20,
        alias: 'item'
      },
      permalink: ({ pagination }) => {
        if (pagination.pageNumber > 0) {
          return `filmes/page/${pagination.pageNumber + 1}/index.html`
        }
        return 'filmes/index.html'
      }
    }
  }

  render ({ pagination }) {
    return renderPaginatedPage(pagination, 'Catálogo BeTor Filmes')
  }
}
