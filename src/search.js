import Fuse from 'fuse.js'
import catalog from './_data/catalog.json'
import renderCatalogFullItem from './render/components/catalogFullItem.js'
import renderBase from './render/base.js'

const fuse = new Fuse(catalog, {
  keys: [
    'title',
    'original_title',
    'name',
    'original_name',
    'release_date',
    'imdb_id',
    'tmdb_id'
  ],
  threshold: 0.2
})

const fetch = async (request, env, ctx) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q') || ''
  if (!q.trim()) {
    return new Response(null, { status: 404 })
  }
  const results = fuse.search(q)
  console.log(results)
  const resultContent = results.map(({ item }) => renderCatalogFullItem(item)).join('')
  return new Response(
    renderBase({
      title: `Resultados da busca "${q}" - Catálogo BeTor`,
      backgroundImage: results.length > 0 && results[0].item?.backdrop_path ? `https://image.tmdb.org/t/p/w1920${results[0].item.backdrop_path}` : undefined,
      q,
      content: `
        <section>
          <h2>Resultado da busca por: ${q}</h2>
          <div class="results">
            ${resultContent}
          </div>
        </section>
      `
    }),
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export default { fetch }
