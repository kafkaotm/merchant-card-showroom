import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { BaseProductCard } from "./base-card";

@customElement("momo-list-card")
export class MomoListCard extends BaseProductCard {
  static styles = [
    BaseProductCard.styles,
    css`
      :host {
        width: 100%;
      }
      article {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }
      h3 {
        flex: 1 1 260px;
        margin: 0;
      }
      .rating,
      .price {
        margin: 0;
        white-space: nowrap;
      }
      button {
        padding: 8px 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #fff;
        font-size: 13px;
        cursor: pointer;
      }
      button[data-action="add-to-cart"] {
        background: #ff5678;
        border-color: #ff5678;
        color: #fff;
        font-weight: 600;
      }
    `,
  ];

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
