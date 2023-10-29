import api from "../api/axiosConfig";
import { Product } from "../types";

const PRODUCT_BASE_URL = "/products";

class ProductService {
  getAllProducts() {
    return api.get<Array<Product>>(PRODUCT_BASE_URL);
  }

  getProductById(productId: string) {
    return api.get<Product>(`${PRODUCT_BASE_URL}/${productId}`);
  }

  updateProduct(productId: string, product: Product) {
    return api.put<Product>(`${PRODUCT_BASE_URL}/${productId}`, product);
  }
}

export default new ProductService();
