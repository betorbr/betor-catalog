import Fuse from 'fuse.js'
import items from './_data/items.json'
import renderItems from './components/items.js'
import renderBase from './components/pages/base.js'

const fuse = new Fuse(items, {
  keys: [
    'info.title',
    'info.original_title',
    'info.name',
    'info.original_name',
    'info.release_date',
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
  const itemsHTML = renderItems(results.map(({ item }) => item))
  console.log(results)
  return new Response(
    renderBase(itemsHTML, { title: `Resultados da busca "${q}" - Catálogo BeTor`, q }),
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export default { fetch }
