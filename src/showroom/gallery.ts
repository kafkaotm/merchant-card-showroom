import type { createCardRegistry } from "../core/card-registry";
import type { Product } from "../core/product";

type Registry = ReturnType<typeof createCardRegistry<unknown, string>>;

// Exported so the detail/editor view can push a live update onto an
// already-mounted card element, not just set attributes at creation time.
export function applyProductAttributes(el: HTMLElement, product: Product): void {
  el.setAttribute("product-title", product.title);
  el.setAttribute("price", String(product.price));
  el.setAttribute("rating", String(product.rating));
  el.setAttribute("review-count", String(product.reviewCount));
}

function createCardElement(tagName: string, product: Product): HTMLElement {
  const el = document.createElement(tagName);
  applyProductAttributes(el, product);
  return el;
}

// Purely a DOM-wiring function: given a registered type's views, render one
// section per view with one card per product. Doesn't require the actual
// Lit definitions to be loaded — it only ever creates elements by tag name
// and sets attributes, which is what makes it unit-testable without a real
// browser. Visual correctness is verified separately, in a real browser.
export function renderGallery(
  container: HTMLElement,
  registry: Registry,
  type: string,
  products: Product[],
): void {
  const definition = registry.get(type);
  if (!definition) {
    container.replaceChildren();
    return;
  }

  container.replaceChildren(
    ...Object.entries(definition.views).map(([viewName, tagName]) => {
      const section = document.createElement("section");
      const heading = document.createElement("h2");
      heading.textContent = viewName;
      section.append(heading, ...products.map((product) => createCardElement(tagName, product)));
      return section;
    }),
  );
}
