import { describe, expect, it } from "vitest";
import { attachActionFeedback } from "../../src/showroom/action-feedback";

describe("attachActionFeedback", () => {
  it("shows a follow message when a card-follow event bubbles up through root", () => {
    const root = document.createElement("div");
    const status = document.createElement("p");
    const card = document.createElement("div");
    root.append(card);
    attachActionFeedback(root, status);

    card.dispatchEvent(new CustomEvent("card-follow", { bubbles: true }));

    expect(status.textContent).toBe("已加入追蹤");
  });

  it("shows an add-to-cart message when a card-add-to-cart event bubbles up through root", () => {
    const root = document.createElement("div");
    const status = document.createElement("p");
    const card = document.createElement("div");
    root.append(card);
    attachActionFeedback(root, status);

    card.dispatchEvent(new CustomEvent("card-add-to-cart", { bubbles: true }));

    expect(status.textContent).toBe("已加入購物車");
  });
});
