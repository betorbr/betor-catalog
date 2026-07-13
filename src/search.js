import Fuse from 'fuse.js'
import searchCatalog from './_data/searchCatalog.json'
import renderCatalogFullItem from './render/components/catalogFullItem.js'
import renderBase from './render/base.js'

const expandSearchItem = (item) => ({
  ...item,
  title: item.t || item.n,
  original_title: item.ot,
  name: item.n,
  original_name: item.on,
  release_date: item.rd,
  imdb_id: item.ii,
  tmdb_id: item.ti,
  backdrop_path: item.bp,
  poster_path: item.pp,
  item_type: item.it,
  available_seasons: item.as === null ? undefined : item.as,
  items: (item.items || []).map((nested) => ({
    ...nested,
    item_type: nested.it,
    imdb_id: nested.ii,
    tmdb_id: nested.ti,
    provider_url: nested.pu,
    provider_slug: nested.ps,
    download_url: nested.du,
    torrent_name: nested.tn,
    magnet_dn: nested.md,
    magnet_xt: nested.mx,
    magnet_uri: nested.mu,
    languages: nested.lg || [],
    torrent_size: nested.sz,
    torrent_files: nested.fs,
    torrent_num_peers: nested.np,
    torrent_num_seeds: nested.ns,
    seasons: nested.ss,
    updated_at: nested.ua,
    inserted_at: nested.ia
  }))
})

const fuse = new Fuse(searchCatalog, {
  keys: [
    't',
    'ot',
    'n',
    'on',
    'rd',
    'ii',
    'ti'
  ],
  threshold: 0.2
})

const fetch = async (request, env, ctx) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q') || ''
  const seasonValue = url.searchParams.get('season') || null
  const season = seasonValue ? parseInt(seasonValue) : null
  if (!q.trim()) {
    return new Response(null, { status: 404 })
  }
  const results = fuse.search(q)
  const expandedResults = results.map((result) => ({
    ...result,
    item: expandSearchItem(result.item)
  }))
  const filteredResults = expandedResults.filter(({ item }) => {
    if (season) {
      return item.available_seasons?.includes(season)
    }
    return true
  }).map(({ item }) => {
    if (!season) {
      return { item }
    }
    const filteredItems = item.items.filter((nested) => {
      if (nested.seasons) {
        return nested.seasons.includes(season)
      }
      return false
    })
    return { item: { ...item, items: filteredItems } }
  })
  const resultContent = filteredResults.map(({ item }) => renderCatalogFullItem(item)).join('')
  const firstItem = expandedResults[0]?.item

  return new Response(
    renderBase({
      title: `Resultados da busca "${q}" - Catálogo BeTor`,
      backgroundImage: firstItem?.backdrop_path ? `https://image.tmdb.org/t/p/w1920${firstItem.backdrop_path}` : undefined,
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
