import renderHome from './render/pages/home.js'

export default class Home {
  data () {
    return {
      permalink: 'index.html'
    }
  }

  render ({ items, catalogMovies, catalogTvs }) {
    const newlyItems = items.slice(0, 50)
    const newlyCatalogMovies = catalogMovies.sort((a, b) => new Date(b.inserted_at) - new Date(a.inserted_at)).slice(0, 8)
    const newlyCatalogTvs = catalogTvs.sort((a, b) => new Date(b.inserted_at) - new Date(a.inserted_at)).slice(0, 8)
    return renderHome({ newlyItems, newlyCatalogMovies, newlyCatalogTvs })
  }
}
