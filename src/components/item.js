import { itemPosterURL, itemTitle, itemImdbUrl, itemTmdbUrl } from '../fns.js'
import renderProvider from './provider.js'

const itemTypeTag = ({ item_type: itemType }) => {
  if (itemType === 'movie') return '<div class="item-type movie">Filme</div>'
  if (itemType === 'tv') return '<div class="item-type tv">Série</div>'
  throw new Error(`Invalid item type: ${itemType}`)
}

export default item => {
  const typeTag = itemTypeTag(item)
  const imdbTag = item.imdb_id ? `<a href="${itemImdbUrl(item)}" target="_blank">IMDb</a>` : ''
  const tmdbTag = item.tmdb_id ? `<a href="${itemTmdbUrl(item)}" target="_blank">TMDB</a>` : ''
  return `
    <div class="item">
      ${typeTag}
      <div class="poster">
        <img src="${itemPosterURL(item)}" />
      </div>
      <div class="details">
        <div class="title">${itemTitle(item)}</div>
        <div class="external-links">
          ${imdbTag}
          ${tmdbTag}
        </div>
        ${item.providers.map(renderProvider.bind(null, item)).join('')}
      </div>
    </div>
  `
}
