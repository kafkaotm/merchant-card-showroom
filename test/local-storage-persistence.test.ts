import { beforeEach, describe, expect, it } from "vitest";
import { createLocalStoragePersistence } from "../src/core/local-storage-persistence";

interface Product {
  id: string;
  title: string;
}

describe("createLocalStoragePersistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns undefined for an id that was never saved", () => {
    const persistence = createLocalStoragePersistence<Product>("products");

    expect(persistence.load("missing")).toBeUndefined();
  });

  it("save() then load() returns the same value", () => {
    const persistence = createLocalStoragePersistence<Product>("products");

    persistence.save("p1", { id: "p1", title: "ASUS 筆電" });

    expect(persistence.load("p1")).toEqual({ id: "p1", title: "ASUS 筆電" });
  });

  it("namespaces keys so two persistence instances don't collide", () => {
    const products = createLocalStoragePersistence<Product>("products");
    const deals = createLocalStoragePersistence<Product>("deals");

    products.save("1", { id: "1", title: "product one" });
    deals.save("1", { id: "1", title: "deal one" });

    expect(products.load("1")).toEqual({ id: "1", title: "product one" });
    expect(deals.load("1")).toEqual({ id: "1", title: "deal one" });
  });
});
