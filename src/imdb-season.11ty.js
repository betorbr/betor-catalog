import renderItems from './components/items.js'
import renderBase from './components/pages/base.js'

export default class IMDB {
  data () {
    return {
      pagination: {
        data: 'itemsByImdbIdAndSeason',
        size: 1,
        alias: 'group'
      },
      permalink: ({ group }) => (`imdb/${group.key}/season/${group.season}/index.html`)
    }
  }

  render ({ group }) {
    const itemsHTML = renderItems(group.items)
    return renderBase(itemsHTML, { title: `IMDB #${group.key} Temporada ${group.season} - Catálogo BeTor` })
  }
}
