import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { BaseProductCard } from "./base-card";

@customElement("momo-grid-card")
export class MomoGridCard extends BaseProductCard {
  static styles = css`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }
  `;

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
