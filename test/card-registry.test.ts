import { describe, expect, it } from "vitest";
import { createCardRegistry } from "../src/core/card-registry";

interface FakeSchema {
  fields: string[];
}
type FakeView = string;

describe("createCardRegistry", () => {
  it("returns undefined for a type that was never registered", () => {
    const registry = createCardRegistry<FakeSchema, FakeView>();

    expect(registry.get("standard-product")).toBeUndefined();
  });

  it("register() then get() returns the same definition", () => {
    const registry = createCardRegistry<FakeSchema, FakeView>();
    const definition = {
      schema: { fields: ["title", "price"] },
      views: { grid: "GridView" },
    };

    registry.register("standard-product", definition);

    expect(registry.get("standard-product")).toEqual(definition);
  });

  it("throws when registering the same type twice", () => {
    const registry = createCardRegistry<FakeSchema, FakeView>();
    registry.register("standard-product", { schema: { fields: [] }, views: {} });

    expect(() =>
      registry.register("standard-product", { schema: { fields: [] }, views: {} }),
    ).toThrow();
  });

  describe("getView", () => {
    it("returns the specific view for a registered type", () => {
      const registry = createCardRegistry<FakeSchema, FakeView>();
      registry.register("standard-product", {
        schema: { fields: [] },
        views: { grid: "GridView", list: "ListView" },
      });

      expect(registry.getView("standard-product", "list")).toBe("ListView");
    });

    it("returns undefined when the type is not registered", () => {
      const registry = createCardRegistry<FakeSchema, FakeView>();

      expect(registry.getView("standard-product", "grid")).toBeUndefined();
    });

    it("returns undefined when the type is registered but the view name is not", () => {
      const registry = createCardRegistry<FakeSchema, FakeView>();
      registry.register("standard-product", {
        schema: { fields: [] },
        views: { grid: "GridView" },
      });

      expect(registry.getView("standard-product", "list")).toBeUndefined();
    });
  });
});
