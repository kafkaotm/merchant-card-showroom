import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { BaseProductCard } from "./base-card";

@customElement("momo-list-card")
export class MomoListCard extends BaseProductCard {
  static styles = css`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }
  `;

  private emit(name: string) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <article>
        <h3>${this.productTitle}</h3>
        <p class="rating">★ ${this.rating} (${this.reviewCount})</p>
        <p class="price">$${this.price.toLocaleString()}</p>
        <button data-action="follow" @click=${() => this.emit("card-follow")}>加入追蹤</button>
        <button data-action="add-to-cart" @click=${() => this.emit("card-add-to-cart")}>
          放入購物車
        </button>
      </article>
    `;
  }
}
