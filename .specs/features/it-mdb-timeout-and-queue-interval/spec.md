# it-mdb-api Timeout and Queue Interval Specification

**Approved**: 2026-11-02 - user: "aprovado"

## Problem Statement

To ensure `it-mdb-api` cache population has sufficient time (up to 60 seconds) when requesting movie and TV show titles, we need to pass the `timeout=60` query parameter. Additionally, to be more respectful of rate limits and stability, the request queue interval needs to be increased from 1000ms to 3000ms while maintaining `intervalCap: 20`.

## Goals

- [ ] Add `timeout=60` query parameter to `it-mdb-api` requests for both movies and TV shows (`/v1/movies/{imdb_id}?language=pt-BR&timeout=60` and `/v1/tvshows/{imdb_id}?language=pt-BR&timeout=60`).
- [ ] Update `PQueue` interval configuration to `interval: 3000` (with `intervalCap: 20`).

## Out of Scope

- Changes to BeTor API item fetching.
- Changes to Eleventy templates.

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
|----------------------|----------------|-----------|------------|
| Timeout value | `60` | Maximum allowed timeout on `it-mdb-api` for cache population | y |
| Queue interval | `3000` ms (3 seconds) | Requested rate limiting interval adjustment | y |

**Open questions:** none - all resolved above.

---

## User Stories

### P1: Add Timeout Parameter and Adjust Queue Interval ⭐ MVP

**User Story**: As a maintainer, I want `it-mdb-api` requests to include `timeout=60` and the request queue interval to be set to 3000ms, so that cache population can wait up to 60 seconds and requests are spaced properly.

**Why P1**: Ensures reliable cache population and adherence to rate limiting requirements.

**Acceptance Criteria**:

1. WHEN requesting a movie from `it-mdb-api`, the URL SHALL include `timeout=60` query parameter (`?language=pt-BR&timeout=60`).
2. WHEN requesting a TV show from `it-mdb-api`, the URL SHALL include `timeout=60` query parameter (`?language=pt-BR&timeout=60`).
3. The `PQueue` instance for `it-mdb-api` SHALL be initialized with `intervalCap: 20` and `interval: 3000`.

**Independent Test**: Running `betor-catalog data-catalog-items` sends requests with `timeout=60` and uses the 3000ms queue interval.

---

## Edge Cases

- IF `it-mdb-api` takes longer than 60 seconds or fails, THEN `enrichCatalogItem()` SHALL catch the error, log a warning, and return the base catalog item gracefully.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-----|-------|--------|
| TIM-01 | P1: Add Timeout and Queue Interval | Design | Pending |
| TIM-02 | P1: Add Timeout and Queue Interval | Design | Pending |

---

## Sources

- OpenAPI specification: `docs/it-mdb-api-openapi.json`
- User requirements

---

## Success Criteria

- [ ] `it-mdb-api` requests include `timeout=60`.
- [ ] Queue interval is set to 3000ms.

## Checks

**C1** - `it-mdb-api` requests include `timeout=60` (TIM-01)
Proof: code inspection of `src/index.js` fetch URL

**C2** - `PQueue` configured with `intervalCap: 20` and `interval: 3000` (TIM-02)
Proof: code inspection of `src/index.js` queue initialization
