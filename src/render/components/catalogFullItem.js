import renderItem from './item.js'

export default (item) => (`
  <div class="catalog-full-item">
    <div class="about">
      <img
        class="poster"
        alt="${item.title || item.name}"
        src="https://image.tmdb.org/t/p/w200${item.poster_path}" />
      <div class="content">
        <h1>${item.title || item.name}</h1>
        <p>${item.overview}</p>
      </div>
    </div>
    <h2>Torrents:</h2>
    ${item.available_seasons
? `<ul class="available-seasons">
      <li><a href="/imdb/${item.imdb_id}/">Todas temporadas</a></li>
      ${item.available_seasons.map((s) => `<li><a href="/imdb/${item.imdb_id}/season/${s}/">${s}ª temporada</a></li>`).join('')}
    </ul>`
: ''}
    <div class="items">
      ${item.items.map(item => renderItem(item)).join('')}
    </div>
  </div>
`)
