# Catálogo BeTor

Agregador de agregadores ;)

---

Projeto em Node.js com Eleventy para montar o [Catálogo BeTor](https://catalogo.betor.top/) e publicar a busca em um Cloudflare Worker.

## Instalação

### 1. Baixe as dependências

```bash
npm ci
```

Esse comando instala as dependências exatamente como estão travadas no projeto.

### 2. Exponha o comando do projeto no terminal

```bash
npm link
```

Depois disso, o comando `betor-catalog` fica disponível no seu terminal local.

### 3. Confira se o CLI foi instalado corretamente

```bash
betor-catalog --help
```

Esse comando mostra a ajuda do CLI e confirma que o executável está disponível.

## API BeTor

O projeto depende de uma API BeTor para buscar os itens de origem. Você pode:

- usar uma instância local ou própria da API;
- usar a instância pública, desde que tenha uma chave de acesso;
- apontar o CLI para a sua API com `--betor-api-url`;
- autenticar o acesso com `--betor-api-authorization` quando necessário.

A documentação atualizada do contrato da API fica em [docs/betor-openapi.json](docs/betor-openapi.json) e o contexto de uso no projeto está em [docs/betor-api.md](docs/betor-api.md).

## Fluxo completo de build com `betor-catalog`

Depois da instalação, este é o fluxo principal do projeto. A partir daqui, o comando `betor-catalog` passa a ser usado para baixar os dados, consolidar o catálogo e gerar o catálogo final.

### 1. Instale as dependências e disponibilize o comando local

```bash
npm ci
npm link
```

Depois do `npm link`, você já pode seguir com os comandos `betor-catalog` abaixo.

### 2. Baixe os itens brutos da API BeTor

```bash
betor-catalog data-fetch-items -b http://localhost:8000
```

Se estiver usando a instância pública, troque a URL pelo endereço informado para você e inclua o cabeçalho de autorização quando necessário.

### 3. Enriqueça e consolide o catálogo

```bash
betor-catalog data-catalog-items
```

Esse passo gera os arquivos consolidados em `src/_data/`.

### 4. Gere o site estático

```bash
betor-catalog build
```

Esse comando monta o site final com Eleventy.

## Comandos do CLI

### `betor-catalog data-fetch-items`

Busca os itens brutos na API BeTor e grava os dados em `src/_data/items.json`, `src/_data/movies.json` e `src/_data/tvs.json`.

### `betor-catalog data-catalog-items`

Consolida os itens baixados, enriquece os dados com TMDB e gera os arquivos do catálogo em `src/_data/`.

### `betor-catalog build`

Gera o site estático com Eleventy.

### `betor-catalog serve`

Inicia o servidor de desenvolvimento do Eleventy com watch.

## Parâmetros do CLI

### `-b, --betor-api-url <string>`

Define a URL base da API BeTor. O padrão é `http://localhost:8000`.

Se você quiser usar a sua própria instância, o projeto BeTor também é open source e está disponível em [https://github.com/betorbr/betor](https://github.com/betorbr/betor), então você pode subir a sua própria API sem depender de serviços externos.

Se preferir usar a instância pública, solicite uma chave de acesso por e-mail em `betor@betor.top`.

### `-a, --betor-api-authorization <string>`

Informa o valor do cabeçalho `Authorization` no formato Basic para acessar a API BeTor quando ela estiver protegida.

### `-p, --pages-limit <number>`

Limita a quantidade de páginas consultadas na etapa de coleta de itens brutos. Se não for informado, o projeto usa o comportamento padrão sem limite.

### `--exclude-dead-torrents`

Exclui torrents marcados com `torrent_is_dead = true` durante o comando `betor-catalog data-catalog-items`.

## Comandos npm

### `npm ci`

Instala as dependências do projeto de forma limpa, usando o `package-lock.json` como referência.

### `npm link`

Cria um link local para o pacote e disponibiliza o comando `betor-catalog` no terminal.

### `npm run lint`

Executa o lint do projeto com `standard . --fix`, corrigindo automaticamente o que for possível.

### `npm run search-dev`

Sobe o worker de busca em modo de desenvolvimento com `wrangler dev`.

### `npm run search-start`

Alias de `npm run search-dev`; faz exatamente a mesma coisa.

### `npm run search-deploy`

Publica o worker de busca com `wrangler deploy`.
