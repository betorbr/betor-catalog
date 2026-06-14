export default ({ title, content, backgroundImage } = {}) => `<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title || 'Catálogo BeTor'}</title>
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
  <header>
    <a class="header-link" href="/"><h1>Catálogo BeTor</h1></a>
    <ul>
      <li><a href="/catalogo/filmes/">FILMES</a></li>
      <li><a href="/catalogo/series/">SÉRIES</a></li>
      <li><a href="/filmes-e-series/">TORRENTS</a></li>
    </ul>
  </header>
  <main>${content || ''}</main>
  <footer>
    <div class="links">
      <ul>
        <li><a href="https://betor.top" target="_blank">BeTor</a></li>
        <li><a href="https://grafana.betor.top/public-dashboards/1019100df7a84d9daca507137f3b3e51" target="_blank">Status</a></li>
      </ul>
      <ul>
        <li><a href="/guia/prowlarr/">Guia Prowlarr</a></li>
        <li><a href="/guia/baixar/">Baixar Dados</a></li>
      </ul>
      <ul>
        <li><a href="https://github.com/betorbr/betor" target="_blank">Github - betor</a></li>
        <li><a href="https://github.com/betorbr/betor-catalog" target="_blank">Github - betor-catalog</a></li>
      </ul>
    </div>
    <p><strong>Contato/Dúvidas:</strong> betor@betor.top</p>
  </footer>
  <div class="background-image">
    <img src="${backgroundImage || 'https://image.tmdb.org/t/p/w1920/9Z2uDYXqJrlmePznQQJhL6d92Rq.jpg'}" alt="Imagem de fundo" />
  </div>
  <script src="https://momentjs.com/downloads/moment-with-locales.min.js"></script>
  <script src="/static/moment.js"></script>
</body>
</html>`
