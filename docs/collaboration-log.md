# Human-Agent Collaboration Log

`architecture.md` records what the code does and why. This file records
something different: the points where the maintainer (human) redirected,
rejected, or corrected the agent's proposal — the actual judgment calls
behind the architecture, not just their outcome. Written because none of
this survives in commit messages or diffs on its own, and the brief
explicitly asks for this to be assessable.

Entries are in chronological order.

## 1. Scope: which half of the take-home

The brief covers both a full mock momo storefront (Part A) and this card
showroom (Part B). The directory name (`merchant-card-showroom`) suggested
B, but the brief text listed both. Asked the maintainer directly rather
than assuming from the folder name. **Decision: Part B only.**

## 2. First card-type proposal was rejected for having no evidence

Initial proposal picked three card types (standard grid, live-stream,
brand/ad) from general knowledge of the site, and separately claimed
"a framework can't satisfy the sample.html requirement" to justify
choosing Lit.

Maintainer pushed back on both: *"我不太懂為什麼用框架實作會無法達成題目要求，給我看看你定義那幾個不同卡片的網址"*
(show the URLs behind these card types; the framework claim doesn't
add up).

Both were wrong as stated:
- The framework claim was overreach — Vue's `defineCustomElement` compiles
  straight to a real custom element, no wrapper needed. Corrected to
  "Lit is the least-indirection path," not "frameworks can't do it."
- The card types had never actually been checked against the live site.

**Resulting change in process:** stopped asserting things about the real
site from memory; used `claude-in-chrome` to actually browse
momoshop.com.tw before making any further claims about it.

## 3. Working mode: TDD, small delivery, no big upfront generation

Same message also set the collaboration mode: *"我想要用tdd的方式協作，並且先交付小功能，不要一開始就花大token生成"*.
This became the standing workflow for every core-layer piece from here
on — each unit built as its own red → green (→ refactor) cycle, shown to
the maintainer before moving to the next one, rather than generating a
large surface area up front.

## 4. Live verification replaced guessed card types

Browsed momoshop.com.tw directly and found three real, URL-backed card
patterns:
- Standard grid card — `momoshop.com.tw/search/筆電`
- Live/short-video commerce card — `momoshop.com.tw/live/highlight/...`
- Flash-deal card (限時搶購) — `momoshop.com.tw/edm/cmmedm.jsp?...` — notably,
  its "countdown" is remaining stock count, not a clock, and it has no
  rating/review fields at all, unlike the other two.

This replaced the original guessed list and became the evidence basis
for every schema decision after it.

## 5. Live/short-video card cut for being weak evidence

Maintainer questioned the live-stream card directly: *"直播/短影音卡 算是一種卡片嗎？"*

On inspection, the live-stream sidebar item's fields (image, title,
price, CTA) were a strict subset of the standard card's — no field
existed there that didn't already exist on Product. It wasn't proof of a
different *schema*, just a lower-information rendering of the same one.
Proposed the search page's grid/list toggle as a stronger example instead
and verified it live: list view shares the exact same product record as
grid view, but adds inline "add to cart" / "follow" buttons the grid view
doesn't have — a real, verified difference in behavior, not just guessed.

**Decision: swap live-stream card for the List-view card.** Final set:
Grid, List, Deal.

## 6. Two different extension axes, not three flavors of the same thing

Maintainer's question *"所以不同種類的卡片都使用同一份資料嗎"* forced a precise
answer instead of "yes, roughly": Grid and List share one Product schema
(a **view** difference); Deal is a genuinely different schema (a **type**
difference). This distinction became the registry's `type → {schema,
views}` shape.

## 7. Product/Deal relationship, then a hack/overspec audit

Follow-up question *"所以同一個商品的不同種商品卡，吃的資料不一樣？"* led to proposing
a normalized model: `Deal` references `Product` by id rather than
duplicating fields, so editing a Product updates it everywhere it's
rendered (the State Consistency bonus made concrete, not just named).

Maintainer then asked directly: *"吃下去的做法有哪邊hack或overspec之處"*. That
review surfaced real problems with the first version of the proposal:
- Resolving the `productId` reference *inside* the card component would
  make the component depend on a live external store — breaking exactly
  the `sample.html` portability the cards exist to demonstrate.
- A `slotTime` (campaign schedule) field had been added to the Deal
  schema without justification — scope creep from a UI element (the
  schedule sidebar) that isn't part of the card itself.
- A generic, schema-aware foreign-key/relation mechanism would be
  building for a second relation that doesn't exist yet.
- A selector/memoization layer would be solving a performance problem
  that doesn't exist at ~10 mock records.

**Resulting design fix:** resolution (`resolveDeal`) moves to the
showroom app layer; the card component's contract stays flat and
store-independent regardless of how the app models data internally.

## 8. Final scope cut, with cost estimated before committing to it

Maintainer: *"我想要實作grid&list 但保留deal的擴充性，設想執行的成本"* — asked for an
estimate before deciding, not after. Estimate given: keeping the door
open costs only writing `createEntityStore` as a generic factory
(~15–20 minutes over a hardcoded version); building Deal itself (schema,
component, mock data, resolver) was the part actually cut, at zero cost
since it isn't built, but explicitly documented rather than left
ambiguous. **Decision: Grid + List implemented, Deal architecture-only.**

## 9. Git workflow: direct-to-main questioned, PR-per-cycle chosen

After the first TDD cycle was committed straight to `main`, maintainer
asked: *"你直接commit在main 這樣好嗎"*. Presented as a real tradeoff (solo
project, no external reviewer or CI gate, so direct-to-main isn't
inherently wrong) with two alternatives if the concern was something
else: feature-branch-then-fast-forward-merge, or real PRs with
descriptions carrying the tradeoff context commit messages don't have
room for. **Decision: PRs, one per unit of work**, merged by the
maintainer on GitHub, local `main` synced and branches deleted after
each merge. Applied retroactively to the already-committed entity-store
work by splitting it into a branch with the same two commits, then
followed for every cycle since.

## 10. This file

Maintainer asked directly whether the decisions above were being
recorded anywhere, or whether nothing so far seemed worth recording. The
honest answer was no — `architecture.md` had captured outcomes but not
the process, and the brief's "開發流程規劃與 Agent 協作效率評估" /
"Human-Agent Iteration Architecture" criteria have no code artifact to
point to without a file like this one.
