import renderBase from '../base.js'

export default () => renderBase({
  title: 'Guia Prowlarr - Catálogo BeTor',
  content: `
    <section>
      <h1>Guia Prowlarr</h1>
      <p>Este guia mostra como adicionar o arquivo customizado do catálogo BeTor ao Prowlarr. Baixe o arquivo YAML <a href="/static/catalogo-betor.yml" target="_blank">catalogo-betor.yml</a> e coloque-o na pasta customizada do Prowlarr.</p>
    </section>
    <section>
      <ol>
        <li>
          <strong>Localize o diretório de dados:</strong>
          <p>Dependendo do seu ambiente, o diretório de dados do Prowlarr fica em:</p>
          <ul>
            <li><strong>Docker (linuxserver):</strong> <code>/config</code></li>
            <li><strong>Linux/Proxmox:</strong> <code>/var/lib/prowlarr/</code></li>
            <li><strong>Windows:</strong> <code>C:\\ProgramData\\Prowlarr\\</code></li>
          </ul>
        </li>
        <li>
          <strong>Crie a pasta Custom:</strong>
          <p>No diretório de dados, entre na pasta <code>Definitions</code> e crie uma nova pasta com o nome exato <code>Custom</code>.</p>
        </li>
        <li>
          <strong>Baixe o arquivo YAML:</strong>
          <p>Faça download do <a href="/static/catalogo-betor.yml" target="_blank">custom definition do Catálogo BeTor</a> e salve-o localmente.</p>
        </li>
        <li>
          <strong>Adicione o arquivo YAML ao Prowlarr:</strong>
          <p>Cole o arquivo <code>catalogo-betor.yml</code> dentro de <code>/Definitions/Custom</code> no diretório de dados do Prowlarr.</p>
        </li>
        <li>
          <strong>Reinicie o Prowlarr:</strong>
          <p>Reinicie o container ou o serviço do Prowlarr para que ele detecte e carregue o novo arquivo.</p>
        </li>
        <li>
          <strong>Adicione o indexador:</strong>
          <p>Abra a interface do Prowlarr, vá em <strong>Indexers</strong>, clique em <strong>+ Add Indexer</strong> e busque pelo nome do indexador "Catálogo BeTor".</p>
        </li>
      </ol>
    </section>
  `
})
