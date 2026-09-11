import { describe, expect, it, vi } from "vitest";
import { renderEditor } from "../../src/showroom/editor";
import type { FieldSchema } from "../../src/core/field-schema";

const schema: FieldSchema[] = [
  { key: "title", label: "標題", type: "string" },
  { key: "price", label: "價格", type: "number" },
];

describe("renderEditor", () => {
  it("renders one input per field, pre-filled with the current value", () => {
    const container = document.createElement("div");

    renderEditor(container, schema, { title: "ASUS 筆電", price: 27999 }, () => {});

    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(2);
    expect(inputs[0]?.value).toBe("ASUS 筆電");
    expect(inputs[0]?.type).toBe("text");
    expect(inputs[1]?.value).toBe("27999");
    expect(inputs[1]?.type).toBe("number");
  });

  it("calls onChange with the field key and a number value for a number field", () => {
    const container = document.createElement("div");
    const onChange = vi.fn();
    renderEditor(container, schema, { title: "x", price: 100 }, onChange);

    const priceInput = container.querySelectorAll("input")[1]!;
    priceInput.value = "200";
    priceInput.dispatchEvent(new Event("input"));

    expect(onChange).toHaveBeenCalledWith("price", 200);
  });

  it("calls onChange with a string value for a string field", () => {
    const container = document.createElement("div");
    const onChange = vi.fn();
    renderEditor(container, schema, { title: "x", price: 100 }, onChange);

    const titleInput = container.querySelectorAll("input")[0]!;
    titleInput.value = "new title";
    titleInput.dispatchEvent(new Event("input"));

    expect(onChange).toHaveBeenCalledWith("title", "new title");
  });
});
