import renderBase from '../base.js'

export default () => renderBase({
  title: 'Guia Prowlarr - Catálogo BeTor',
  content: `
    <section>
      <h1>Baixar Dados</h1>
      <p>BeTor tem como um dos objetivos democratizar e simplificar o acesso aos dados, inclusive, incentiva a criação de novas soluções baseado neles. Por isso, fica disponível nessa página os dados estruturados utilizados para renderizar todo o catálogo.</p>
      <ul>
        <li><a href="/static/data/items.json" target="_blank">items.json</a> - todos os torrents disponíveis, conteúdo bruto do BeTor.</li>
        <li><a href="/static/data/catalog.json" target="_blank">catalog.json</a> - todos os filmes e séries disponíveis, enriquecidos com TMDb.</li>
      </ul>
    </section>
  `
})
