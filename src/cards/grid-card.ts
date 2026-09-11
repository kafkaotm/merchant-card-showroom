import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { BaseProductCard } from "./base-card";

@customElement("momo-grid-card")
export class MomoGridCard extends BaseProductCard {
  static styles = [
    BaseProductCard.styles,
    css`
      :host {
        width: 220px;
      }
    `,
  ];

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
