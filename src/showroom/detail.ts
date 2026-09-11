import type { createEntityStore } from "../core/entity-store";
import type { createLocalStoragePersistence } from "../core/local-storage-persistence";
import type { FieldSchema } from "../core/field-schema";
import type { Product } from "../core/product";
import { applyProductAttributes } from "./gallery";
import { renderEditor } from "./editor";
import { debounce } from "../core/debounce";

type Store = ReturnType<typeof createEntityStore<Product>>;
type Persistence = ReturnType<typeof createLocalStoragePersistence<Product>>;

// Exported so tests advance fake timers by the same value this module
// actually uses, instead of duplicating the number.
export const PERSIST_DEBOUNCE_MS = 300;

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

  // Only the localStorage write is debounced — store.set() below stays
  // synchronous so the card (and anything else subscribed) still updates
  // on every keystroke. Note: a pending write is lost if the page closes
  // within PERSIST_DEBOUNCE_MS of the last edit; accepted for this scope,
  // see docs/architecture.md.
  const debouncedSave = debounce(
    (id: string, value: Product) => persistence.save(id, value),
    PERSIST_DEBOUNCE_MS,
  );

  const editorContainer = document.createElement("div");
  editorContainer.className = "editor-form";
  renderEditor(editorContainer, schema, current, (key, newValue) => {
    const updated = { ...store.get(productId)!, [key]: newValue };
    store.set(productId, updated);
    debouncedSave(productId, updated);
  });

  store.subscribe(productId, (updated) => {
    applyProductAttributes(card, updated);
  });

  container.replaceChildren(card, editorContainer);
}
