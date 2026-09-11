import { describe, expect, it } from "vitest";
import "../../src/cards/grid-card";

describe("<momo-grid-card>", () => {
  it("renders product title, price, rating, and review count from attributes", async () => {
    const el = document.createElement("momo-grid-card") as HTMLElement & {
      updateComplete: Promise<boolean>;
    };
    el.setAttribute("product-title", "ASUS 華碩 15.6吋輕薄筆電");
    el.setAttribute("price", "27999");
    el.setAttribute("rating", "4.5");
    el.setAttribute("review-count", "364");
    document.body.append(el);

    await el.updateComplete;

    const text = el.shadowRoot?.textContent ?? "";
    expect(text).toContain("ASUS 華碩 15.6吋輕薄筆電");
    expect(text).toContain("27,999");
    expect(text).toContain("4.5");
    expect(text).toContain("364");

    el.remove();
  });
});
