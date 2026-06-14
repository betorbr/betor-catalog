export default (item) => (`
  <a
    class="catalog-item"
    href="/imdb/${item.imdb_id}/">
    <img
      class="poster"
      alt="Poster: ${item.title || item.name}"
      src="https://image.tmdb.org/t/p/w200${item.poster_path}" />
    <div class="title">${item.title || item.name}</div>
  </a>
`)
