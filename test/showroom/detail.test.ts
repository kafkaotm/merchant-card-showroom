import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderDetail, PERSIST_DEBOUNCE_MS } from "../../src/showroom/detail";
import { createEntityStore } from "../../src/core/entity-store";
import { createLocalStoragePersistence } from "../../src/core/local-storage-persistence";
import type { FieldSchema } from "../../src/core/field-schema";
import type { Product } from "../../src/core/product";

const schema: FieldSchema[] = [
  { key: "title", label: "標題", type: "string" },
  { key: "price", label: "價格", type: "number" },
];

describe("renderDetail", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the card and editor, and editing a field updates the card live", () => {
    const store = createEntityStore<Product>();
    const persistence = createLocalStoragePersistence<Product>("test-products");
    store.set("p1", { id: "p1", title: "ASUS 筆電", price: 27999, rating: 4.5, reviewCount: 364 });
    const container = document.createElement("div");

    renderDetail(container, "momo-grid-card", schema, store, persistence, "p1");

    const card = container.querySelector("momo-grid-card")!;
    expect(card.getAttribute("price")).toBe("27999");

    const priceInput = container.querySelectorAll("input")[1]!;
    priceInput.value = "19999";
    priceInput.dispatchEvent(new Event("input"));

    expect(card.getAttribute("price")).toBe("19999");
    expect(store.get("p1")?.price).toBe(19999);
  });

  it("persists an edit so it survives a reload, once the debounce delay elapses", () => {
    const store = createEntityStore<Product>();
    const persistence = createLocalStoragePersistence<Product>("test-products");
    store.set("p1", { id: "p1", title: "ASUS 筆電", price: 27999, rating: 4.5, reviewCount: 364 });
    const container = document.createElement("div");

    renderDetail(container, "momo-grid-card", schema, store, persistence, "p1");
    const titleInput = container.querySelectorAll("input")[0]!;
    titleInput.value = "改過的標題";
    titleInput.dispatchEvent(new Event("input"));

    expect(persistence.load("p1")).toBeUndefined();
    vi.advanceTimersByTime(PERSIST_DEBOUNCE_MS);

    expect(persistence.load("p1")?.title).toBe("改過的標題");
  });

  it("debounces rapid edits into a single persisted write of the latest value", () => {
    const store = createEntityStore<Product>();
    const persistence = createLocalStoragePersistence<Product>("test-products");
    const saveSpy = vi.spyOn(persistence, "save");
    store.set("p1", { id: "p1", title: "ASUS 筆電", price: 27999, rating: 4.5, reviewCount: 364 });
    const container = document.createElement("div");

    renderDetail(container, "momo-grid-card", schema, store, persistence, "p1");
    const priceInput = container.querySelectorAll("input")[1]!;
    for (const value of ["1", "19", "199", "1999", "19999"]) {
      priceInput.value = value;
      priceInput.dispatchEvent(new Event("input"));
    }

    expect(saveSpy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(PERSIST_DEBOUNCE_MS);

    expect(saveSpy).toHaveBeenCalledOnce();
    expect(saveSpy).toHaveBeenLastCalledWith("p1", expect.objectContaining({ price: 19999 }));
  });

  it("does not replace the form while typing (no focus-losing re-render on the field being edited)", () => {
    const store = createEntityStore<Product>();
    const persistence = createLocalStoragePersistence<Product>("test-products");
    store.set("p1", { id: "p1", title: "ASUS 筆電", price: 27999, rating: 4.5, reviewCount: 364 });
    const container = document.createElement("div");

    renderDetail(container, "momo-grid-card", schema, store, persistence, "p1");
    const titleInputBefore = container.querySelectorAll("input")[0]!;
    titleInputBefore.value = "x";
    titleInputBefore.dispatchEvent(new Event("input"));
    const titleInputAfter = container.querySelectorAll("input")[0]!;

    expect(titleInputAfter).toBe(titleInputBefore);
  });
});
