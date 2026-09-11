import { describe, expect, it, vi } from "vitest";
import "../../src/cards/list-card";

async function mountListCard() {
  const el = document.createElement("momo-list-card") as HTMLElement & {
    updateComplete: Promise<boolean>;
  };
  el.setAttribute("product-title", "ASUS 華碩 15.6吋輕薄筆電");
  el.setAttribute("price", "27999");
  el.setAttribute("rating", "4.5");
  el.setAttribute("review-count", "364");
  document.body.append(el);
  await el.updateComplete;
  return el;
}

describe("<momo-list-card>", () => {
  it("renders product title, price, rating, and review count from attributes", async () => {
    const el = await mountListCard();

    const text = el.shadowRoot?.textContent ?? "";
    expect(text).toContain("ASUS 華碩 15.6吋輕薄筆電");
    expect(text).toContain("27,999");
    expect(text).toContain("4.5");
    expect(text).toContain("364");

    el.remove();
  });

  it('emits "card-add-to-cart" when the add-to-cart button is clicked', async () => {
    const el = await mountListCard();
    const handler = vi.fn();
    el.addEventListener("card-add-to-cart", handler);

    el.shadowRoot!.querySelector<HTMLButtonElement>('[data-action="add-to-cart"]')!.click();

    expect(handler).toHaveBeenCalledOnce();
    el.remove();
  });

  it('emits "card-follow" when the follow button is clicked', async () => {
    const el = await mountListCard();
    const handler = vi.fn();
    el.addEventListener("card-follow", handler);

    el.shadowRoot!.querySelector<HTMLButtonElement>('[data-action="follow"]')!.click();

    expect(handler).toHaveBeenCalledOnce();
    el.remove();
  });
});
