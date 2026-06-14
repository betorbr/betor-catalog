import renderItems from './render/pages/items.js'

export default class Items {
  data () {
    return {
      pagination: {
        data: 'items',
        size: 50,
        alias: 'item'
      },
      permalink: ({ pagination }) => {
        if (pagination.pageNumber > 0) {
          return `filmes-e-series/${pagination.pageNumber + 1}/index.html`
        }
        return 'filmes-e-series/index.html'
      }
    }
  }

  render ({ pagination }) {
    return renderItems(pagination, 'Filmes e Séries - Catálogo BeTor')
  }
}
