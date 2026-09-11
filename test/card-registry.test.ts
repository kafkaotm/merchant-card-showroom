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
});
