import renderBase from '../base.js'
import renderItemsPaginated from '../components/itemsPaginated.js'

export default (pagination, title = null) => renderBase({
  title,
  content: `
    <section>
      <p>Filtrar por:</p>
      <ul>
        <li><a href="/filmes-e-series/">Filmes e Séries</a></li>
        <li><a href="/filmes/">Filmes</a></li>
        <li><a href="/series/">Séries</a></li>
      </ul>
      ${renderItemsPaginated(pagination.items, pagination.href.previous, pagination.href.next)}
    </section>
  `
})
