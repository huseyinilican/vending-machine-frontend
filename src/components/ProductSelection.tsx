import React from "react";
import { Product } from "../types";

type ProductSelectionProps = {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  balance: number;
};

const ProductSelection: React.FC<ProductSelectionProps> = ({
  products,
  onSelectProduct,
  balance,
}) => {
  return (
    <div className="product-selection">
      <h3>Product Selection</h3>
      <div className="product-buttons">
        {products?.map((product, index) => (
          <button
            key={index}
            onClick={() => onSelectProduct(product)}
            disabled={product.price > balance}
          >
            {product.name} ({product.price} units)
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSelection;
