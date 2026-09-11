# Architecture & Tradeoffs

This document is written incrementally, alongside the commits that make each
decision — not produced after the fact. Sections fill in as the corresponding
piece is built.

## Architecture

### Two extension axes for cards

Real momo product cards split along two different axes, and the design has
to support both without collapsing them into one:

- **View variant** — the same product record, rendered differently. A
  search-results grid card and its list-view counterpart show identical
  data (title, price, rating, review count) but differ in layout and in
  which actions are exposed inline (list view adds "add to cart" /
  "follow" buttons the grid view doesn't have).
- **Type** — a genuinely different data shape. A flash-sale (限時搶購) card
  has no rating/review fields at all, but has fields a standard card
  doesn't (discount percent, remaining stock count, a campaign CTA label).

This repo implements the view-variant axis (Grid + List, one product
schema, two renderers) and leaves the type axis as a documented extension
point rather than implementing a second type — see Roadmap.

### Core layer (`src/core/`)

Two small, independent primitives, deliberately not merged into one
"store" abstraction because they model different things:

- **`createEntityStore<T>()`** (`entity-store.ts`) — a keyed collection of
  data that changes at runtime and that UI reacts to. `get`/`set` by id,
  plus `subscribe(id, listener)` scoped to that one id — setting one
  entity only notifies listeners of that entity, not every subscriber on
  the store. This is the mechanism the Editor panel and cards will use to
  stay consistent: edit a product once, every card rendering that product
  updates, nothing rendering a different product re-renders.
- **`createCardRegistry<TSchema, TView>()`** (`card-registry.ts`) — static
  per-type configuration decided at composition time: `register(type, {
  schema, views })`, `get(type)`, `getView(type, viewName)`. This is *not*
  built on top of `entity-store` even though both are "a Map keyed by a
  string" at a glance, because the two have different failure semantics:
  overwriting a product's data via `entityStore.set()` is normal (that's
  what editing does); registering the same card type twice is almost
  always a bug (typo'd type name, a module double-imported), so
  `register()` throws instead of silently replacing.

Both are generic factories (`createEntityStore<T>()`, not a hardcoded
`ProductStore`) rather than one-off singletons, so adding a second
collection — e.g. a `deals` store, if the Deal type is ever built — is
one more call at the composition root, not a refactor of the primitive
itself.

### Cards stay flat; resolution happens one layer up

If a Deal type is added later, it will reference a Product by id rather
than duplicating title/image/brand onto every deal record. The resolution
of that reference (`resolveDeal(deal, products) → flat props`) will live
in the showroom app, never inside the card component itself. A card
component's public contract (attributes/properties) must stay fully
self-contained — no reach into a shared store — because `sample.html`
loads only the compiled card bundle with no app or store running. A card
that needs to query a store to render itself stops being portable, which
would undercut the entire point of shipping cards as standalone web
components.

## Tradeoffs

- **Web Components (Lit) for cards, vanilla TS for the showroom shell,
  not one framework for everything.** The base requirement that cards be
  usable from a plain `sample.html` via `<script>`/custom-element tags
  pushed this: a framework component would need a wrapper (e.g.
  `react-to-webcomponent`) to become a true portable custom element,
  adding indirection the native approach doesn't need. (Vue's
  `defineCustomElement` is a legitimate counter-example — it compiles
  straight to a standard custom element with no wrapper — so this is a
  "framework can't do it" claim we don't make; it's a "this path has the
  least indirection" choice.)
- **No CSS framework in the card bundle.** Cards ship as a dependency for
  other pages to embed; bundling utility-class CSS would leak into or
  bloat the consumer page. Plain CSS + custom properties/parts inside
  Shadow DOM keeps the bundle self-contained.
- **Single package, two Vite build targets, not a monorepo.** There are
  exactly two build outputs (the card library, the showroom app). A
  monorepo with separate packages would be structure for a scale this
  project doesn't have.
- **Scope cut: Deal (flash-sale) card is architecture-only, not
  implemented.** Grid + List already prove the view-variant extension
  axis "for free" (they're required anyway). Deal would prove the type
  extension axis, but costs a second schema, component, mock dataset, and
  a `Product` reference resolver — real cost for a bonus point. Decision:
  keep the core layer (registry, entity store) type-agnostic enough that
  adding Deal later doesn't require touching existing code, document the
  exact steps here, and spend the saved time on Grid/List + persistence
  being solid instead of three shallower card types.
- **No generic foreign-key/relation system in the schema layer.** When
  Deal is added, its `productId` reference will be resolved by one
  hand-written function specific to Deal→Product, not by a generic
  "schema field type: ref" mechanism the registry understands. There is
  exactly one relation in this domain; generalizing for hypothetical
  future relations before a second one exists is speculative.

## Roadmap

- **Deal (flash-sale) card** — second registered type. Needs: `Deal`
  schema (`productId`, `discountPercent`, `stockRemaining`, `ctaLabel` —
  no scheduling/slot-time fields; that belongs to a campaign-scheduling
  UI this project doesn't build), a `FlashDealCard` component, a
  `resolveDeal(deal, products)` view-model mapper living in the showroom
  app (not the card library), and a second `createEntityStore<Deal>()`
  instance. No changes needed to `entity-store.ts` or `card-registry.ts`.
- **Live/short-video card** — considered and set aside (see
  `docs/collaboration-log.md`); weakest evidence of a genuinely distinct
  schema versus Grid/List. Candidate if time remains after Deal.
- **Testing scope** — unit tests only, targeting the logic with real
  risk (store, registry, resolver, validation). No e2e/visual regression
  suite; not worth it at this scope, called out explicitly rather than
  silently skipped.
- **Availability/stock-status field (貨態) not implemented.** Real momo
  grid cards sometimes replace the price entirely with a status line —
  "售完補貨中" (sold out, restocking) or "10/01 00:00 開賣" (presale, with a
  timestamp) — instead of showing a price at all. Current `BaseProductCard`
  has no field for this. Extension point when it's built: an
  `availability: "in-stock" | "restocking" | "presale"` property (plus
  `availabilityAt` for the presale timestamp) belongs on `BaseProductCard`
  itself, since it's the same product-data axis as price/rating (Grid and
  List must both reflect it identically); the decision of *whether to
  render price or status text* is a per-view concern and stays local to
  each card's own `render()`, not lifted into the base. List's
  "add to cart" button would also need to disable/hide when availability
  isn't `in-stock` — a List-specific behavior branch, not a base concern.
- **Untested: multiple simultaneous subscribers on the same entity id.**
  `entity-store`'s fan-out (`listeners.get(id)?.forEach(...)`) is
  Set-based and should support any number of listeners per id, but no
  test currently subscribes two listeners to the same id and asserts
  both get notified — only single-subscriber and cross-id isolation are
  covered. A regression that only notified the first listener would slip
  through today. Noted rather than fixed now; low risk (the fan-out is a
  three-line `forEach`) but real, since the Editor panel + a standalone
  card both watching the same product is exactly this shape once it's
  built.
