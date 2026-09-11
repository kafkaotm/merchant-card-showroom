import { describe, expect, it } from "vitest";
import { createEntityStore } from "../src/core/entity-store";

interface Product {
  id: string;
  title: string;
}

describe("createEntityStore", () => {
  it("returns undefined for an id that was never set", () => {
    const store = createEntityStore<Product>();

    expect(store.get("missing")).toBeUndefined();
  });

  it("set() then get() returns the same entity by id", () => {
    const store = createEntityStore<Product>();

    store.set("p1", { id: "p1", title: "ASUS 筆電" });

    expect(store.get("p1")).toEqual({ id: "p1", title: "ASUS 筆電" });
  });

  describe("subscribe", () => {
    it("notifies a subscriber of that id when set() is called", () => {
      const store = createEntityStore<Product>();
      const received: Product[] = [];
      store.subscribe("p1", (value) => received.push(value));

      store.set("p1", { id: "p1", title: "ASUS 筆電" });

      expect(received).toEqual([{ id: "p1", title: "ASUS 筆電" }]);
    });

    it("does not notify a subscriber listening to a different id", () => {
      const store = createEntityStore<Product>();
      const received: Product[] = [];
      store.subscribe("p2", (value) => received.push(value));

      store.set("p1", { id: "p1", title: "ASUS 筆電" });

      expect(received).toEqual([]);
    });

    it("stops notifying once unsubscribed", () => {
      const store = createEntityStore<Product>();
      const received: Product[] = [];
      const unsubscribe = store.subscribe("p1", (value) => received.push(value));

      unsubscribe();
      store.set("p1", { id: "p1", title: "ASUS 筆電" });

      expect(received).toEqual([]);
    });
  });
});
