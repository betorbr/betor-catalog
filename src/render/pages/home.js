import renderBase from '../base.js'
import renderCatalogItemsList from '../components/catalogItemsList.js'
import renderItemsPaginated from '../components/itemsPaginated.js'

export default ({ newlyItems, newlyCatalogMovies, newlyCatalogTvs }) => renderBase({
  backgroundImage: newlyCatalogMovies[0]?.backdrop_path ? `https://image.tmdb.org/t/p/w1920${newlyCatalogMovies[0].backdrop_path}` : undefined,
  content: `
    <section>
      <h1>Lançamentos</h1>
      <h2>Filmes</h2>
      ${renderCatalogItemsList(newlyCatalogMovies)}
      <p class="text-right"><a href="/catalogo/filmes/">Ver todos</a></p>
      <h2>Séries</h2>
      ${renderCatalogItemsList(newlyCatalogTvs)}
      <p class="text-right"><a href="/catalogo/series/">Ver todos</a></p>
    </section>
    <section>
      <h1>Torrents</h1>
      ${renderItemsPaginated(newlyItems, null, '/torrents/2/')}
    </section>
  `
})
