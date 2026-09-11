# Merchant Card Showroom

Analysis + reusable implementation of real momo product card types (mocked
front-end only, no real API calls). Scope and rationale: see
[`docs/architecture.md`](docs/architecture.md).

Status: scaffold only — quickstart commands below will be filled in as each
piece lands.

## Scope

- Grid card and List card: two views of the same product record.
- Deal (flash-sale) card: architecture leaves room for it as a second type;
  not implemented. See Roadmap in `docs/architecture.md`.

## Develop

```
npm install
npm run dev        # showroom app
npm run test       # unit tests
npm run build:lib  # builds dist/momo-cards.js, consumed by sample.html
```
