import type { createCardRegistry } from "../core/card-registry";
import type { createEntityStore } from "../core/entity-store";
import type { Product } from "../core/product";

type Registry = ReturnType<typeof createCardRegistry<unknown, string>>;
type Store = ReturnType<typeof createEntityStore<Product>>;

// Exported so the detail/editor view can push a live update onto an
// already-mounted card element, not just set attributes at creation time.
export function applyProductAttributes(el: HTMLElement, product: Product): void {
  el.setAttribute("product-title", product.title);
  el.setAttribute("price", String(product.price));
  el.setAttribute("rating", String(product.rating));
  el.setAttribute("review-count", String(product.reviewCount));
}

function createCardElement(tagName: string, product: Product, store: Store): HTMLElement {
  const el = document.createElement(tagName);
  applyProductAttributes(el, product);
  // No unsubscribe collected: renderGallery is called once at app boot and
  // never re-rendered, so this subscription lives exactly as long as the
  // page does — there is no teardown moment to clean it up for. Building
  // dispose/unsubscribe plumbing for a re-render scenario that doesn't
  // exist in this app would be speculative, not defensive.
  store.subscribe(product.id, (updated) => applyProductAttributes(el, updated));
  return el;
}

// Purely a DOM-wiring function: given a registered type's views, render one
// section per view with one card per product. Doesn't require the actual
// Lit definitions to be loaded — it only ever creates elements by tag name
// and sets attributes, which is what makes it unit-testable without a real
// browser. Visual correctness is verified separately, in a real browser.
//
// Takes both `products` (the initial list/order to render) and `store`
// (subscribed per card so a later edit — e.g. via the Detail view's editor
// — is reflected here too, without a page reload).
export function renderGallery(
  container: HTMLElement,
  registry: Registry,
  type: string,
  products: Product[],
  store: Store,
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
      section.append(
        heading,
        ...products.map((product) => createCardElement(tagName, product, store)),
      );
      return section;
    }),
  );
}
