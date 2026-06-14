import renderItems from './render/pages/items.js'

export default class Movies {
  data () {
    return {
      pagination: {
        data: 'movies',
        size: 50,
        alias: 'item'
      },
      permalink: ({ pagination }) => {
        if (pagination.pageNumber > 0) {
          return `filmes/${pagination.pageNumber + 1}/index.html`
        }
        return 'filmes/index.html'
      }
    }
  }

  render ({ pagination }) {
    return renderItems(pagination, 'Filmes - Catálogo BeTor')
  }
}
