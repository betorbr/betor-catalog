const providerSlugNameMapping = {
  bludv: 'BLUDV',
  'comando-torrents': 'Comando Torrents',
  'torrent-dos-filmes': 'Torrent Dos Filmes',
  'starck-filmes': 'Starck Filmes',
  'rede-torrent': 'Rede Torrent',
  'sem-torrent': 'Sem Torrent'
}

export const providerName = (providerSlug) => (providerSlugNameMapping[providerSlug] || providerSlug)

export const tmdbUrl = (item) => (`https://www.themoviedb.org/${item.item_type}/${item.tmdb_id}`)

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const toLocaleString = (value) => {
  const date = new Date(value)
  return date.toLocaleString('pt-br', { timeZone: 'America/Sao_Paulo' })
}
