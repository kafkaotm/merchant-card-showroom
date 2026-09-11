import { LitElement } from "lit";
import { property } from "lit/decorators.js";

// Shared contract for every card that renders a standard-product record.
// Flat primitive properties only (not one object prop) — this is what
// lets sample.html set them as plain HTML attributes with no app/store
// running. Extracted here once Grid and List needed the exact same four
// fields, not speculatively ahead of a second consumer.
export abstract class BaseProductCard extends LitElement {
  // Named productTitle, not title — HTMLElement already has a native
  // `title` property (tooltip text); reusing it would silently collide.
  @property({ attribute: "product-title" })
  productTitle = "";

  @property({ type: Number })
  price = 0;

  @property({ type: Number })
  rating = 0;

  @property({ type: Number, attribute: "review-count" })
  reviewCount = 0;
}
