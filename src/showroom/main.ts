import "../cards"; // registers <momo-grid-card>, <momo-list-card> as a side effect
import { createCardRegistry } from "../core/card-registry";
import type { Product } from "../core/product";
import productsData from "../../mock-data/products.json";
import { renderGallery } from "./gallery";

const registry = createCardRegistry<unknown, string>();
registry.register("standard-product", {
  schema: {},
  views: { grid: "momo-grid-card", list: "momo-list-card" },
});

const products = productsData as Product[];

const app = document.querySelector<HTMLDivElement>("#app")!;
renderGallery(app, registry, "standard-product", products);
