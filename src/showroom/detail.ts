import type { createEntityStore } from "../core/entity-store";
import type { createLocalStoragePersistence } from "../core/local-storage-persistence";
import type { FieldSchema } from "../core/field-schema";
import type { Product } from "../core/product";
import { applyProductAttributes } from "./gallery";
import { renderEditor } from "./editor";

type Store = ReturnType<typeof createEntityStore<Product>>;
type Persistence = ReturnType<typeof createLocalStoragePersistence<Product>>;

// One card + its schema-driven editor, wired to a single product id.
//
// The store subscription updates only the card, never re-renders the
// editor form itself: the form's own input already holds the value the
// user just typed, so feeding the store update back into a fresh render
// would replace the input mid-keystroke and drop focus/cursor position.
// The form is the write side, the card is the read side — they don't
// need to be re-derived from each other on every keystroke.
export function renderDetail(
  container: HTMLElement,
  tagName: string,
  schema: FieldSchema[],
  store: Store,
  persistence: Persistence,
  productId: string,
): void {
  const current = store.get(productId);
  if (!current) {
    container.replaceChildren();
    return;
  }

  const card = document.createElement(tagName);
  applyProductAttributes(card, current);

  const editorContainer = document.createElement("div");
  editorContainer.className = "editor-form";
  renderEditor(editorContainer, schema, current, (key, newValue) => {
    const updated = { ...store.get(productId)!, [key]: newValue };
    store.set(productId, updated);
    persistence.save(productId, updated);
  });

  store.subscribe(productId, (updated) => {
    applyProductAttributes(card, updated);
  });

  container.replaceChildren(card, editorContainer);
}
