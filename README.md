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

O projeto consome o endpoint público de itens da API BeTor (`https://v1.betor.top/download-items/`). Você pode apontar o CLI para outro endpoint de download de itens usando `--download-items-url`.

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
betor-catalog data-fetch-items
```

Por padrão, usa o endpoint público `https://v1.betor.top/download-items/`. Você pode customizar a URL com `-u` ou `--download-items-url`.

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

### `-u, --download-items-url <string>`

Define a URL completa do endpoint `download-items`. O padrão é `https://v1.betor.top/download-items/`.

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
