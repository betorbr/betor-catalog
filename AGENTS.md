## betor-catalog

Node.js/Eleventy catalog project with a Cloudflare Worker search entry point. The CLI lives in `src/cli.js` and the main runtime code in `src/index.js`; the worker entry is `src/search.js`. Feature planning and specs follow the `tlc-spec-driven` skill under `.specs/`; deeper project knowledge lives in `docs/`. Generated catalog data lives in `src/_data/` and should be regenerated, not hand-edited.

## Policy

- Treat `src/_data/*.json` as generated; regenerate it through the CLI instead of editing it by hand.
- Feature planning and implementation follow the `tlc-spec-driven` skill workflow under `.specs/`.

## Where things are

- CLI actions and data pipeline: `src/cli.js`
- Core catalog logic, cache handling, and TMDB enrichment: `src/index.js`
- Cloudflare Worker search entry: `src/search.js`
- Eleventy pages and components: `src/*.11ty.js` and `src/render/`
- Generated catalog data: `src/_data/`
- Spec-driven planning artifacts: `.specs/`
- Project knowledge and guides: `docs/`

## Running and verifying

- Use `npm ci` for a clean install.
- Use `npm run lint`; it runs `standard . --fix`.
- Use `npm link` when you need the `betor-catalog` CLI on PATH for local runs.
- Use `betor-catalog data-fetch-items` and `betor-catalog data-catalog-items` to regenerate catalog data.
- Use `betor-catalog build` to build the site.
- Use `npm run search-dev` or `npm run search-start`; both map to `wrangler dev`.
- Use `npm run search-deploy`; it maps to `wrangler deploy`.
- Set `TMDB_API_KEY` before `betor-catalog data-catalog-items`; TMDB enrichment throws without it.

## Conventions that differ from defaults

- Prefer the `betor-catalog` CLI over running `node src/cli.js` directly.
- The worker entry point is `src/search.js`, not the main CLI entry.
- Linting is autofixing-first via StandardJS.

## Known pitfalls

- `src/_data/*.json` is generated content and will be overwritten by the CLI flow.
- Missing `TMDB_API_KEY` breaks catalog enrichment.
