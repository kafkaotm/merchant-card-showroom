// Cards only dispatch card-follow / card-add-to-cart events — they don't
// track "followed"/"in cart" state themselves (see docs/architecture.md:
// a card's job is emitting the event, not owning what happens next). This
// is the showroom's minimal reaction to those events: visible text, not a
// real cart/follow-list feature, which the brief doesn't ask for.
export function attachActionFeedback(root: HTMLElement, statusEl: HTMLElement): void {
  root.addEventListener("card-follow", () => {
    statusEl.textContent = "已加入追蹤";
  });
  root.addEventListener("card-add-to-cart", () => {
    statusEl.textContent = "已加入購物車";
  });
}
