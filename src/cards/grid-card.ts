import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("momo-grid-card")
export class MomoGridCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
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

  render() {
    return html`
      <article>
        <h3>${this.productTitle}</h3>
        <p class="price">$${this.price.toLocaleString()}</p>
        <p class="rating">★ ${this.rating} (${this.reviewCount})</p>
      </article>
    `;
  }
}
