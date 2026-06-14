export const itemPosterURL = item => (item.info?.poster_path ? `https://image.tmdb.org/t/p/w200${item.info?.poster_path}` : 'https://placehold.co/200x300?text=BeTor')

export const itemTitle = item => (item.info?.title || item.info?.name)

export const providerName = slug => {
  if (slug === 'comando-torrents') return 'Comando'
  if (slug === 'bludv') return 'BLUDV'
  if (slug === 'torrent-dos-filmes') return 'Torrent dos Filmes'
  if (slug === 'starck-filmes') return 'Starck Filmes'
  if (slug === 'rede-torrent') return 'Rede Torrent'
  if (slug === 'sem-torrent') return 'Sem Torrent'
  return slug
}

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const toLocaleString = value => {
  const date = new Date(value)
  return date.toLocaleString('pt-br', { timeZone: 'America/Sao_Paulo' })
}

export const itemImdbUrl = ({ imdb_id: imdbId }) => {
  return `https://www.imdb.com/pt/title/${imdbId}/`
}

export const itemTmdbUrl = ({ item_type: itemType, tmdb_id: tmdbId }) => {
  if (itemType === 'movie') return `https://www.themoviedb.org/movie/${tmdbId}`
  if (itemType === 'tv') return `https://www.themoviedb.org/tv/${tmdbId}`
  throw new Error(`Invalid item type: ${itemType}`)
}
