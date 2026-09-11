# Merchant Card Showroom

Analysis + reusable implementation of real momo product card types
(mocked front-end only, no real API calls, no real backend). This repo
covers **Part B only** (Merchant Card Showroom) of the take-home brief —
Part A (a full mock momo storefront) was not attempted; see
[`docs/collaboration-log.md`](docs/collaboration-log.md) entry 1 for why.

Architecture, tradeoffs, and roadmap: [`docs/architecture.md`](docs/architecture.md).
How the design actually got decided — including where an agent proposal
was wrong and got corrected: [`docs/collaboration-log.md`](docs/collaboration-log.md).

## What's here

- **Two views, one type**: `<momo-grid-card>` and `<momo-list-card>` both
  render the standard-product schema, same record, different layout (the
  "view variant" extension axis — see architecture doc). List adds
  加入追蹤/放入購物車 buttons the grid view doesn't have.
- **Gallery** — lists every card type/view for the full mock product set.
- **Detail + Editor** — one product, a schema-driven form next to it;
  editing a field updates that card *and* every Gallery card for the same
  product live, and persists to `localStorage` (debounced).
- **`sample.html`** — the cards used standalone, outside this app
  entirely: no build tool, no dev server, no framework runtime. Open it
  directly in a browser after `npm run build:lib`.
- Not implemented: a second card *type* (Deal/flash-sale) — the registry
  is designed to take one, but building it wasn't worth the cost for this
  scope. Full reasoning in `docs/architecture.md`.

## Try it

```
npm install

# Full showroom app (Gallery + Detail/Editor)
npm run dev

# Standalone card usage — no server needed
npm run build:lib
# then just open sample.html in a browser
```

## Develop

```
npm run test       # unit tests (Vitest)
npm run typecheck  # tsc --noEmit
npm run build      # showroom app -> dist-app/
npm run build:lib  # portable card bundle -> dist/momo-cards.js (ESM)
                   # + dist/momo-cards.iife.js (classic script, what sample.html loads)
```
