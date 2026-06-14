import renderBase from '../base.js'
import renderCatalogFullItem from '../components/catalogFullItem.js'

export default (item) => renderBase({
  title: `${item.title || item.name} - Catálogo BeTor`,
  backgroundImage: item.backdrop_path ? `https://image.tmdb.org/t/p/w1920${item.backdrop_path}` : undefined,
  content: `
    <section>
      ${renderCatalogFullItem(item)}
    </section>
  `
})
