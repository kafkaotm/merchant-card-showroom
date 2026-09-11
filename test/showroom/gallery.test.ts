import { describe, expect, it } from "vitest";
import { createCardRegistry } from "../../src/core/card-registry";
import { renderGallery } from "../../src/showroom/gallery";
import type { Product } from "../../src/core/product";

describe("renderGallery", () => {
  it("renders one card element per product for each registered view", () => {
    const registry = createCardRegistry<unknown, string>();
    registry.register("standard-product", {
      schema: {},
      views: { grid: "momo-grid-card", list: "momo-list-card" },
    });
    const products: Product[] = [
      { id: "p1", title: "A", price: 100, rating: 4, reviewCount: 10 },
      { id: "p2", title: "B", price: 200, rating: 5, reviewCount: 20 },
    ];
    const container = document.createElement("div");

    renderGallery(container, registry, "standard-product", products);

    const gridCards = container.querySelectorAll("momo-grid-card");
    const listCards = container.querySelectorAll("momo-list-card");
    expect(gridCards).toHaveLength(2);
    expect(listCards).toHaveLength(2);
    expect(gridCards[0]?.getAttribute("product-title")).toBe("A");
    expect(gridCards[0]?.getAttribute("price")).toBe("100");
    expect(listCards[1]?.getAttribute("review-count")).toBe("20");
  });

  it("renders nothing for a type that isn't registered", () => {
    const registry = createCardRegistry<unknown, string>();
    const container = document.createElement("div");

    renderGallery(container, registry, "missing-type", []);

    expect(container.children).toHaveLength(0);
  });
});
