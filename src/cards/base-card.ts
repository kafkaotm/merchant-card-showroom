import { LitElement, css, type CSSResultGroup } from "lit";
import { property } from "lit/decorators.js";

// Shared contract for every card that renders a standard-product record.
// Flat primitive properties only (not one object prop) — this is what
// lets sample.html set them as plain HTML attributes with no app/store
// running. Extracted here once Grid and List needed the exact same four
// fields, not speculatively ahead of a second consumer.
export abstract class BaseProductCard extends LitElement {
  // Shared "card chrome" (border/padding/text hierarchy) every view
  // needs identically. Layout (grid tile vs. list row) is view-specific
  // and stays in each subclass, composed via `static styles = [BaseProductCard.styles, css\`...\`]`.
  static styles: CSSResultGroup = css`
    :host {
      display: block;
      box-sizing: border-box;
      font-family: system-ui, -apple-system, sans-serif;
      border: 1px solid #e2e2e2;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
    }
    h3 {
      margin: 0 0 8px;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.4;
      color: #222;
    }
    .price {
      margin: 4px 0;
      font-size: 20px;
      font-weight: 700;
      color: #e2001a;
    }
    .rating {
      margin: 4px 0;
      font-size: 13px;
      color: #767676;
    }
  `;

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
