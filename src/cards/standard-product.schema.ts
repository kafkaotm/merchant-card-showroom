import type { FieldSchema } from "../core/field-schema";

// Field-level schema for the standard-product type, matching the Product
// shape in src/core/product.ts. This is what the Editor panel's
// schema-driven form generation reads — a new field on Product needs an
// entry here to become editable, nothing more.
export const standardProductSchema: FieldSchema[] = [
  { key: "title", label: "標題", type: "string" },
  { key: "price", label: "價格", type: "number" },
  { key: "rating", label: "評分", type: "number" },
  { key: "reviewCount", label: "評論數", type: "number" },
];
