import { Product } from "../types";

type Props = {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  balance: number;
  pending: boolean;
};

export default function ProductSelection({
  products,
  onSelectProduct,
  balance,
  pending,
}: Props) {
  if (!products)
    return <div className="empty-state">Loading the selection…</div>;
  if (!products.length)
    return (
      <div className="empty-state">No products available. Check back soon.</div>
    );
  return (
    <div className="product-grid">
      {products.map((product, index) => {
        const available = product.stock > 0;
        const affordable = balance >= product.price;
        return (
          <article className="product-card" key={product.id}>
            <div
              className={"product-art tone-" + (index % 4)}
              aria-hidden="true"
            >
              <span className="product-code">
                {String(index + 1).padStart(2, "0")}
              </span>
              <svg viewBox="0 0 120 160" className="drink-art">
                <path
                  d="M46 12h28v22l10 16v88q0 12-12 12H48q-12 0-12-12V50l10-16z"
                  fill="currentColor"
                  opacity=".2"
                />
                <path
                  d="M46 12h28v22l10 16v88q0 12-12 12H48q-12 0-12-12V50l10-16z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M46 22h28M46 34h28"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <rect
                  x="36"
                  y="65"
                  width="48"
                  height="47"
                  rx="2"
                  fill="currentColor"
                />
                <path d="M54 89l6-10 6 10-6 10z" fill="white" />
              </svg>
              <span className="stock-badge">
                {available ? product.stock + " available" : "Sold out"}
              </span>
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Served chilled · {product.temperature}°C</p>
              <div className="product-bottom">
                <span className="price">
                  {product.price} <small>units</small>
                </span>
                <button
                  className="buy-button"
                  disabled={!available || !affordable || pending}
                  onClick={() => onSelectProduct(product)}
                >
                  {!available
                    ? "Sold out"
                    : affordable
                      ? "Buy drink ↗"
                      : "Add " + (product.price - balance) + " units"}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
