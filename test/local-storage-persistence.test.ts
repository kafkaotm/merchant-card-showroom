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

  it("returns undefined instead of throwing when stored value is malformed JSON", () => {
    const persistence = createLocalStoragePersistence<Product>("products");
    localStorage.setItem("products:p1", "{not valid json");

    expect(persistence.load("p1")).toBeUndefined();
  });

  it("does not throw when the underlying storage read itself throws", () => {
    const persistence = createLocalStoragePersistence<Product>("products");
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new DOMException("blocked", "SecurityError");
    };

    try {
      expect(persistence.load("p1")).toBeUndefined();
    } finally {
      Storage.prototype.getItem = originalGetItem;
    }
  });

  it("does not throw when the underlying storage write itself throws", () => {
    const persistence = createLocalStoragePersistence<Product>("products");
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new DOMException("quota exceeded", "QuotaExceededError");
    };

    try {
      expect(() => persistence.save("p1", { id: "p1", title: "x" })).not.toThrow();
    } finally {
      Storage.prototype.setItem = originalSetItem;
    }
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
