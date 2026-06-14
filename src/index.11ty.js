import renderPaginatedPage from './components/pages/paginated.js'

export default class Index {
  data () {
    return {
      pagination: {
        data: 'items',
        size: 20,
        alias: 'item'
      },
      permalink: ({ pagination }) => {
        if (pagination.pageNumber > 0) {
          return `page/${pagination.pageNumber + 1}/index.html`
        }
        return 'index.html'
      }
    }
  }

  render ({ pagination }) {
    return renderPaginatedPage(pagination)
  }
}
