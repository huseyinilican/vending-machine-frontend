import React from "react";
import { Product } from "../types";
import "./ProductSelection.css";

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
      <div className="product-row">
        {products?.map((product, index) => (
          <button
            key={index}
            className="product-card"
            onClick={() => onSelectProduct(product)}
            disabled={!(balance >= product.price) || product.stock == 0}
          >
            {product.stock > 0 ? (
              <div className="product-stock">
                {}Stock: {product.stock}
              </div>
            ) : (
              <div className="product-out-of-stock">Out Of Stock</div>
            )}

            <img
              className="product-image"
              src={product.imageUrl}
              alt={product.name}
            />
            <div className="product-name">{product.name}</div>
            <div className="product-price">{product.price} units</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSelection;
