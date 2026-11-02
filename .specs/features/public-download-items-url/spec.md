# Public Download Items URL Specification

**Approved**: 2026-11-02 - user: "aprovado"

## Problem Statement

The catalog ingestion process currently relies on a protected BeTor API base URL (`betorApiUrl` via `-b` flag) along with Basic Authorization headers (`betorApiAuthorization` via `-a` flag) pointing to `/v1/admin/download-items/`. With the introduction of a public, unauthenticated public endpoint (`https://v1.betor.top/download-items/`), we need to simplify the CLI and data fetcher by replacing `betorApiUrl` with the full `download-items` endpoint URL (`download-items-url`, defaulting to `https://v1.betor.top/download-items/`) and removing authorization headers entirely.

## Goals

- [ ] Replace `betorApiUrl` / `--betor-api-url` with `download-items-url` / `--download-items-url` (short flag `-u`), defaulting to `https://v1.betor.top/download-items/`.
- [ ] Remove `betorApiAuthorization` / `--betor-api-authorization` and basic authorization header logic from `src/cli.js` and `src/index.js`.
- [ ] Update `dataFetchItems()` in `src/index.js` to fetch directly from the configured `download-items-url` without sending any `Authorization` header.
- [ ] Update GitHub Actions workflow (`build-and-deploy.yml`) and documentation (`README.md`, `AGENTS.md`) to reflect the new `download-items-url` configuration and removal of authorization secrets.

## Out of Scope

- Changes to catalog enrichment or TMDB/it-mdb-api integration.
- Changes to Eleventy page rendering.

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
|----------------------|----------------|-----------|------------|
| CLI flag for download items URL | `--download-items-url` (short alias `-u`) | Clear and descriptive naming for the full download-items endpoint URL | y |
| Default value | `https://v1.betor.top/download-items/` | The public unauthenticated public endpoint provided by the maintainer | y |

**Open questions:** none - all resolved above.

---

## User Stories

### P1: Public Download Items URL and Removal of Auth ⭐ MVP

**User Story**: As a maintainer, I want the catalog data fetcher to use a direct public `download-items` endpoint URL by default without requiring basic authentication headers, so that data ingestion is simplified and uses the public endpoint.

**Why P1**: Simplifies ingestion to use the public unauthenticated public endpoint `https://v1.betor.top/download-items/`.

**Acceptance Criteria**:

1. WHEN running the CLI with `data-fetch-items`, the system SHALL use the URL provided by `--download-items-url` (or short flag `-u`), defaulting to `https://v1.betor.top/download-items/`.
2. WHEN requesting the items dump in `dataFetchItems()`, the system SHALL send a request to the configured `download-items-url` without any `Authorization` header.
3. The CLI definition in `src/cli.js` SHALL NOT define `--betor-api-authorization` or `-a`.
4. The GitHub Actions workflow (`build-and-deploy.yml`) SHALL NOT reference `BETOR_API_AUTHORIZATION` or `-a`.

**Independent Test**: Running `betor-catalog data-fetch-items` successfully downloads items from `https://v1.betor.top/download-items/` without credentials.

---

## Edge Cases

- IF the response from `download-items-url` is not OK (non-2xx), THEN `dataFetchItems()` SHALL throw an informative error with the status code.
- IF `download-items` response is missing `download_url`, THEN `dataFetchItems()` SHALL throw an error indicating `download_url` is missing.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-----|-------|--------|
| PUB-01 | P1: Public Download Items URL | Design | Pending |
| PUB-02 | P1: Public Download Items URL | Design | Pending |
| PUB-03 | P1: Public Download Items URL | Design | Pending |
| PUB-04 | P1: Public Download Items URL | Design | Pending |

---

## Sources

- User instructions for public `download-items` endpoint (`https://v1.betor.top/download-items/`).

---

## Success Criteria

- [ ] `betor-catalog data-fetch-items` successfully fetches items from `https://v1.betor.top/download-items/` by default.
- [ ] Authorization flags and headers are completely removed.
- [ ] Documentation and workflow files updated.

## Checks

**C1** - `data-fetch-items` uses `--download-items-url` defaulting to `https://v1.betor.top/download-items/` (PUB-01)
Proof: run test | `betor-catalog data-fetch-items` successfully connects to public endpoint

**C2** - Request sent without Authorization header (PUB-02)
Proof: code inspection of `src/index.js`

**C3** - CLI and CI configurations updated to remove authorization flags and secrets (PUB-03, PUB-04)
Proof: git status / workflow diff check
