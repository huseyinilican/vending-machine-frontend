import { useEffect, useState } from "react";
import "./App.css";
import { Product } from "./types";
import ProductService from "../src/services/ProductService";
import VendingMachineDisplay from "./components/VendingMachineDisplay";

function App() {
  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    ProductService.getAllProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
      <VendingMachineDisplay products={products} />
    </>
  );
}

export default App;
