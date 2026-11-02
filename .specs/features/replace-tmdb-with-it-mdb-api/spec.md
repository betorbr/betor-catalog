# Replace TMDB API with it-mdb-api Specification

**Approved**: 2026-11-02 - user: "pode considerar que https://it-mdb-api.dgls.me/v1/movies/ permite colocar o valor de ttXXXXX diretamente, nao precisa fazer o replace. ele aceita o id do imdb inteiro ttXXXXX ou o id do tmdb XXXX."

## Problem Statement

Catalog item enrichment currently calls the TMDB API directly (`/3/find/{imdb_id}`) using an API key (`TMDB_API_KEY`) and maintains a local file cache (`.cache/`). To streamline data fetching, leverage pre-cached metadata from `it-mdb-api`, and remove external API keys and local caching overhead, we are replacing TMDB API integration with the `it-mdb-api` service (`https://it-mdb-api.dgls.me/`).

## Goals

- [ ] Replace `getInfoFromTmdbAPI` with `getInfoFromItMdbApi` calling `https://it-mdb-api.dgls.me/v1/movies/tt{imdb_id}` and `https://it-mdb-api.dgls.me/v1/tvshows/tt{imdb_id}` with query parameter `language=pt-BR`.
- [ ] Configure `PQueue` for `it-mdb-api` with `intervalCap: 20` and `interval: 1000`.
- [ ] Map `it-mdb-api` response fields (`tmdb_poster_path`, `tmdb_backdrop_path`, `year`, etc.) to match the expected catalog item properties (`poster_path`, `backdrop_path`, `release_date`, etc.).
- [ ] Remove all local caching logic (`.cache/`, `getInfoCache`, `setInfoCache`) from `src/index.js`.
- [ ] Remove `TMDB_API_KEY` references, environment checks, and GitHub Actions cache action from `.github/workflows/build-and-deploy.yml`.

## Out of Scope

- Changes to BeTor API raw items dump retrieval (`data-fetch-items`).
- Changes to Eleventy templates and frontend UI components beyond standard field normalization.

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
|----------------------|----------------|-----------|------------|
| IMDB ID formatting for `it-mdb-api` path `/v1/movies/tt{imdb_id}` | Pass `imdb_id` directly (`ttXXXXX`) | The API accepts `ttXXXXX` or TMDB ID directly without needing string manipulation | y |
| Response field mapping | Map `tmdb_poster_path` to `poster_path`, `tmdb_backdrop_path` to `backdrop_path`, `year` to `release_date` / `first_air_date` | Ensures complete compatibility with existing Eleventy rendering templates and search compaction | y |

**Open questions:** none - all resolved above.

---

## User Stories

### P1: Replace TMDB with it-mdb-api and Remove Local Caching ⭐ MVP

**User Story**: As a maintainer, I want the catalog enrichment process to query `it-mdb-api` instead of TMDB, using rate limiting (`intervalCap: 20`, `interval: 1000`) and without local file caching, so that builds are fast, resilient, and independent of TMDB API keys.

**Why P1**: Core architectural migration required to use `it-mdb-api` and clean up legacy cache and keys.

**Acceptance Criteria**:

1. WHEN enriching a movie catalog item, the system SHALL call `https://it-mdb-api.dgls.me/v1/movies/${imdb_id}` with `language=pt-BR`.
2. WHEN enriching a TV show catalog item, the system SHALL call `https://it-mdb-api.dgls.me/v1/tvshows/${imdb_id}` with `language=pt-BR`.
3. The system SHALL queue API requests using `PQueue` with `intervalCap: 20` and `interval: 1000`.
4. The system SHALL map `tmdb_poster_path` to `poster_path`, `tmdb_backdrop_path` to `backdrop_path`, and `year` to `release_date` / `first_air_date`.
5. The system SHALL NOT use local file caching (`.cache/` directory or `getInfoCache` / `setInfoCache` methods).
6. IF `it-mdb-api` returns an error or failure, THEN the system SHALL log a warning and return the un-enriched catalog item gracefully.
7. The GitHub Actions workflow (`build-and-deploy.yml`) SHALL NOT reference `TMDB_API_KEY` or cache the `.cache` directory.

**Independent Test**: Running `betor-catalog data-catalog-items` successfully enriches catalog items via `it-mdb-api` without requiring `TMDB_API_KEY` and without creating `.cache/`.

---

## Edge Cases

- IF an item has no `imdb_id`, THEN the system SHALL skip enrichment and return the item unchanged.
- IF `it-mdb-api` times out or fails (non-OK response), THEN the system SHALL catch the error, log a warning, and fallback to the base catalog item without crashing the build.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-----|-------|--------|
| MDB-01 | P1: Replace TMDB with it-mdb-api | Design | Pending |
| MDB-02 | P1: Replace TMDB with it-mdb-api | Design | Pending |
| MDB-03 | P1: Replace TMDB with it-mdb-api | Design | Pending |
| MDB-04 | P1: Replace TMDB with it-mdb-api | Design | Pending |
| MDB-05 | P1: Replace TMDB with it-mdb-api | Design | Pending |

---

## Sources

- OpenAPI: `docs/it-mdb-api-openapi.json`
- Base URL: `https://it-mdb-api.dgls.me/`

---

## Success Criteria

- [ ] Catalog enrichment completes successfully using `it-mdb-api`.
- [ ] `.cache/` code and GitHub Actions cache steps are completely removed.
- [ ] `TMDB_API_KEY` is removed from codebase and CI workflow.

## Checks

**C1** - Catalog enrichment queries `it-mdb-api` for movies and tv shows (MDB-01, MDB-02)
Proof: run test | `betor-catalog data-catalog-items` runs successfully without TMDB_API_KEY

**C2** - Rate limiting uses `PQueue` with `intervalCap: 20` and `interval: 1000` (MDB-03)
Proof: code inspection of `src/index.js`

**C3** - Response fields correctly mapped to `poster_path`, `backdrop_path`, and `release_date` / `first_air_date` (MDB-04)
Proof: catalog build succeeds and generates valid items.json and catalog.json

**C4** - Local cache logic and `TMDB_API_KEY` references removed from source and CI workflow (MDB-05)
Proof: git diff shows removal of `.cache` methods and `TMDB_API_KEY`

