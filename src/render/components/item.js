import { providerName, tmdbUrl, formatBytes, toLocaleString } from '../../utils.js'

export default (item) => {
  const torrentName = item.torrent_name || item.magnet_dn || item.magnet_xt

  return `
    <div
      class="item"
      data-item
      data-item-id="${item.id}"
      data-item-type="${item.item_type}"
      data-item-imdb-id="${item.imdb_id}"
      data-item-tmdb-id="${item.tmdb_id}"
      data-item-last-updated="${item.last_updated}"
      data-provider
      data-provider-url="${item.provider_url}"
      data-torrent
      data-torrent-name="${torrentName}"
      data-torrent-magnet-uri="${item.magnet_uri}"
      data-torrent-languages="${item.languages.join(',')}"
      ${item.torrent_size ? `data-torrent-size="${item.torrent_size}"` : ''}
      ${item.torrent_files ? `data-torrent-files="${item.torrent_files.join(';')}"` : ''}
      data-torrent-num-peers="${item.torrent_num_peers || 0}"
      data-torrent-num-seeds="${item.torrent_num_seeds || 0}"
      data-torrent-inserted-at="${item.inserted_at}">
        <div class="top">
          <a class="provider" href="${item.provider_url}" target="_blank">${providerName(item.provider_slug)}</a>
          <div class="download">
            <a href="${item.magnet_uri}">🧲</a>
            ${item.download_url ? `<a href="${item.download_url}" target="_blank">⬇️</a>` : ''}
          </div>
        </div>
        <div class="header">
          <div class="name">${torrentName}</div>
          <div class="download-info">
            <div class="peers-seeds">
              <span><strong>Seeds:</strong> ${item.torrent_num_seeds || '-'}</span>
              <span><strong>Peers:</strong> ${item.torrent_num_peers || '-'}</span>
            </div>
            ${item.torrent_size ? `<div class="size">${formatBytes(item.torrent_size)}</div>` : ''}
          </div>
        </div>
        <div class="content-info">
          ${item.imdb_id || item.tmdb_id
? `<div class="databases">
            ${item.imdb_id ? `<div><strong>IMDb:</strong> <a class="imdb" href="https://www.imdb.com/pt/title/${item.imdb_id}/" target="_blank">${item.imdb_id}</a></div>` : ''}
            ${item.tmdb_id ? `<div><strong>TMDb:</strong> <a class="tmdb" href="${tmdbUrl(item)}/" target="_blank">${item.tmdb_id}</a></div>` : ''}
          </div>`
: ''}
          ${item.languages.length > 0
? `<div class="languages">
            <div><strong>Idiomas:</strong></div>
            <div class="tags">${item.languages.map(lang => `<span class="language">${lang}</span>`).join('')}</div>
          </div>`
: ''}
        </div>
        ${item.torrent_files
? `<div class="files">
          ${item.torrent_files.map(file => `<span class="file">${file}</span>`).join('')}
        </div>`
: ''}
        <div class="updated">
          <p data-updated-at="${item.updated_at}">Última atualização: ${toLocaleString(item.updated_at)}</p>
        </div>
      </div>
  `
}
