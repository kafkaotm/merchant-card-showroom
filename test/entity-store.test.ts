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
});
