import "../cards"; // registers <momo-grid-card>, <momo-list-card> as a side effect
import "./showroom.css";
import { createCardRegistry } from "../core/card-registry";
import { createEntityStore } from "../core/entity-store";
import { createLocalStoragePersistence } from "../core/local-storage-persistence";
import type { Product } from "../core/product";
import { standardProductSchema } from "../cards/standard-product.schema";
import productsData from "../../mock-data/products.json";
import { renderGallery } from "./gallery";
import { renderDetail } from "./detail";

const registry = createCardRegistry<typeof standardProductSchema, string>();
registry.register("standard-product", {
  schema: standardProductSchema,
  views: { grid: "momo-grid-card", list: "momo-list-card" },
});

const mockProducts = productsData as Product[];
const productStore = createEntityStore<Product>();
const persistence = createLocalStoragePersistence<Product>("products");

// Hydrate: a persisted edit wins over the mock default for that id.
for (const mock of mockProducts) {
  productStore.set(mock.id, persistence.load(mock.id) ?? mock);
}
const hydratedProducts = mockProducts.map((mock) => productStore.get(mock.id)!);

const app = document.querySelector<HTMLDivElement>("#app")!;

const galleryHeading = document.createElement("h1");
galleryHeading.textContent = "Gallery — 所有商品卡";
const galleryEl = document.createElement("div");

const detailHeading = document.createElement("h1");
detailHeading.textContent = "Detail — 單一商品卡 + 編輯";
const detailEl = document.createElement("div");

app.append(galleryHeading, galleryEl, detailHeading, detailEl);

renderGallery(galleryEl, registry, "standard-product", hydratedProducts);
renderDetail(
  detailEl,
  "momo-grid-card",
  standardProductSchema,
  productStore,
  persistence,
  mockProducts[0]!.id,
);
