import renderItems from './components/items.js'
import renderBase from './components/pages/base.js'

export default class IMDB {
  data () {
    return {
      pagination: {
        data: 'itemsByImdbId',
        size: 1,
        alias: 'group'
      },
      permalink: ({ group }) => (`imdb/${group.key}/index.html`)
    }
  }

  render ({ group }) {
    const itemsHTML = renderItems(group.items)
    return renderBase(itemsHTML, { title: `IMDB #${group.key} - Catálogo BeTor` })
  }
}
