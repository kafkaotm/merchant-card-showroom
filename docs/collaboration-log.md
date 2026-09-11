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

Maintainer pushed back on both: *"看看哪些框架實作會無法達成題目要求，給我看看你定義那幾個不同卡片的網址"*
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

Same message also set the collaboration mode: *"用tdd的方式協作，並且先交付小功能，不要一開始就花大token生成"*.
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

## 6. Pushing past "same schema" to entity identity

Grid and List had already been settled as sharing one Product schema (a
**view** difference); Deal as a different schema (a **type** difference).
Maintainer pushed one level deeper: *"所以同一個商品的不同種商品卡，吃的資料不一樣？"* —
not "is the schema different" (already answered) but "if a Deal card and
a Grid card show the *same real-world product*, is that connection real
or coincidental." That's a question about entity identity, not schema
shape, and it's what actually produced the Product/Deal relational model:
`Deal` references `Product` by id rather than duplicating fields, so
editing a Product updates it everywhere it's rendered (the State
Consistency bonus made concrete, not just named).

## 7. Hack/overspec audit on that relational model

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

## 10. This file's first draft

Maintainer asked directly whether the decisions above were being
recorded anywhere, or whether nothing so far seemed worth recording. The
honest answer was no — `architecture.md` had captured outcomes but not
the process, and the brief's "開發流程規劃與 Agent 協作效率評估" /
"Human-Agent Iteration Architecture" criteria have no code artifact to
point to without a file like this one. (That first draft was opened as
its own PR and left as a draft, to be finished last.)

## 11. CardRegistry's `views` map questioned mid-implementation

While the Grid/List cards were being built, maintainer asked about the
registry test fixture directly: *"你的views: { grid: "GridView", list:
"ListView" }，為什麼這樣包 資料同時要給grid & list嗎？"* — i.e., does each view get
its own copy of the product data?

Answer, clarified for the record: `views` holds **renderers**, not data.
There is exactly one copy of a product's data (in the entity store);
`views` is a lookup table from view name to which component draws it.
Rendering a card is "look up the data, look up the renderer, hand one to
the other" — never "duplicate the data per view."

## 12. Test-suite self-review, on request

Maintainer: *"掃一下目前的testcase 有沒有什麼問題"*. Review surfaced three real
gaps, ranked by severity:
1. Fail-soft paths in `local-storage-persistence.ts` asserted "doesn't
   throw" but never asserted `console.warn` actually fired — a silent
   regression (warning quietly removed) would have passed all tests.
2. `entity-store`'s `unsubscribe()` never removed the outer Map entry
   once a listener Set emptied — an unbounded, untested memory leak.
3. No test proved multiple simultaneous subscribers on the same id all
   get notified (Set-based fan-out, plausible but unverified).

Maintainer's instruction: *"先修第1、2點,第3點先記到 roadmap"*. Both fixes were
verified by proving the bug existed first — e.g. for the leak, added the
observability method (`subscribedIdCount()`) *before* the fix and
confirmed the count stayed nonzero after a full unsubscribe, then fixed
it and confirmed it returned to zero. #3 logged in the roadmap, not
fixed, per instruction.

## 13. A process mistake, caught by the maintainer noticing a merge timestamp

A docs commit recording the "persistence isn't debounced" gap was pushed
to `feat/showroom-editor` — 23 seconds *after* the maintainer had already
merged that PR on GitHub. The merge commit's parent didn't include it.
The branch was then deleted (both locally and on GitHub) as part of the
normal post-merge cleanup, which orphaned that commit — it was never in
`main` and doesn't exist on any remaining branch. Caught by inspecting
`git merge-base --is-ancestor` when writing a *replacement* version of
the same note (debounce was, by that point, actually built, so the
content needed rewriting regardless). Disclosed directly rather than
quietly rewritten as if it had always been correct.

## 14. Styling wasn't asked for structurally — it was requested, then audited

Maintainer asked for basic CSS "使卡片符合版型" (make the cards match a real
layout) directly, rather than it being planned in advance. Delivered
shared "card chrome" on `BaseProductCard` composed per-view (Grid/List
add only their own layout), verified by screenshot in a real browser —
consistent with the standing rule that UI work gets checked visually,
not just unit-tested.

## 15. Debounce: avoided breaking an already-tested contract

Roadmap had logged "persistence isn't debounced — every keystroke writes
to localStorage." Maintainer: *"先記到roadmap 下個pr實作"*, then later:
*"做完debonce"*. The naive fix (debounce inside
`local-storage-persistence.ts`'s `save()`) was rejected before being
built: that module's tests already assert synchronous save-then-load,
and debouncing there would break them for a concern (call frequency)
that belongs to the *caller*, not the adapter. Built `debounce()` as a
standalone utility instead, applied only at the `detail.ts` call site;
`store.set()` (and the card's live update) stayed synchronous. The first
version of the "proves debouncing works" test only checked the final
persisted value — which a *non*-debounced implementation also satisfies,
since the last synchronous write already has the right value. Rewritten
to spy on `persistence.save` directly and assert call count/timing
instead, which is what actually distinguishes the two.

## 16. Gallery/Detail live sync: the original tradeoff didn't survive scrutiny

`architecture.md` had documented, as an accepted gap: Gallery renders a
snapshot at boot and won't reflect a Detail edit until reload; fixing it
was framed as unnecessary because it only mattered "within one session."
Maintainer asked plainly: *"為什麼不訂閱store？這樣有什麼好處"*. Re-examining the
actual benefit (simpler `renderGallery` contract, no subscription
lifecycle to manage) against the actual cost revealed the original
framing was weaker than presented: Gallery and Detail sit on the *same
page*, stacked vertically — not separate routes a user navigates
between — so the inconsistency is immediately visible, not a narrow
edge case. Reversed the decision: `renderGallery` now takes the store
and subscribes each card to its own id, reusing the exact mechanism
`detail.ts` already established. Verified live: editing price in Detail
now updates both of Gallery's cards for that product immediately.

## 17. Verification gap disclosed instead of glossed over: `sample.html` via plain double-click

Asked directly to confirm three basic requirements were met, including
"提供 sample html". Checking it honestly surfaced a real gap never
tested before: `sample.html` loaded the card bundle via
`<script type="module">`, and Chrome blocks a module script from
fetching another module over `file://` (CORS) — meaning a plain
double-click open, as opposed to opening it through a local static
server (the only way it had actually been tested so far), could
plausibly fail. Presented two options rather than picking one
unilaterally: document the server requirement, or add an IIFE build
(classic, non-module script — not subject to that restriction) so true
double-click-to-open works. Maintainer picked the latter (**"b"**).

Could not get a screenshot-level proof of the fix for this exact
scenario — `claude-in-chrome`'s navigate tool refuses `file://` URLs by
design, and `screencapture` lacked OS permission in this environment.
Disclosed that gap explicitly rather than claiming verification that
didn't happen; the maintainer then manually confirmed it worked.