import renderBase from '../base.js'
import renderCatalogItemsPaginated from '../components/catalogItemsPaginated.js'

export default (pagination, title = null) => renderBase({
  title,
  backgroundImage: pagination.items[0]?.backdrop_path ? `https://image.tmdb.org/t/p/w1920${pagination.items[0].backdrop_path}` : undefined,
  content: `
    <section>
      ${renderCatalogItemsPaginated(pagination.items, pagination.href.previous, pagination.href.next)}
    </section>
  `
})
