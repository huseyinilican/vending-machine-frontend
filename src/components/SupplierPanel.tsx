import { Product } from "../types";
import "./SupplierPanel.css";
import ProductService from "../services/ProductService";
import MachineSettingsService from "../services/MachineSettingsService";

import { useEffect } from "react";

type SupplierPanelPopupProps = {
  onClose: () => void;
  products: Array<Product> | undefined;
  setProducts: React.Dispatch<React.SetStateAction<Product[] | undefined>>;
  collectedMoney: number;
  setCollectedMoney: React.Dispatch<React.SetStateAction<number>>;
};

const SupplierPanel: React.FC<SupplierPanelPopupProps> = ({
  onClose,
  products,
  setProducts,
  collectedMoney,
  setCollectedMoney,
}) => {
  [];

  const onAddToStocks = () => {
    const productList: Array<Product> = [];

    products?.forEach((product) => {
      const element = document.getElementById(
        product.name + "-stock-input"
      ) as HTMLInputElement;
      if (element != undefined) {
        const value = element.value;
        if (value != undefined && value != "") {
          product.stock += Number(value);
          productList.push(product);
        }
      }
    });
    updateProducts(productList);
  };

  const onPriceChanges = () => {
    const productList: Array<Product> = [];
    products?.forEach((product) => {
      const element = document.getElementById(
        product.name + "-price-input"
      ) as HTMLInputElement;
      if (element != undefined) {
        const value = element.value;
        if (value != undefined && value != "") {
          product.price = Number(value);
          productList.push(product);
        }
      }
    });
    updateProducts(productList);
  };

  const onCollectMoney = () => {
    MachineSettingsService.getMachineSettings().then((response) => {
      MachineSettingsService.updateMachineSettingsWithKey({
        ...response.data,
        collectedMoney: response.data.collectedMoney + collectedMoney,
      }).then(() => {
        setCollectedMoney(0);
      });
    });
  };

  const onReset = () => {};

  const updateProducts = (productList: Array<Product>) => {
    ProductService.updateProducts(productList).then((response) => {});
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="supplier-panel">
          <h3>Supplier Panel</h3>
          <div className="supplier-product-list">
            <h4>Products</h4>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Stock To Add</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>
                      <input
                        id={product.name + "-price-input"}
                        type="number"
                        defaultValue={product.price}
                      />
                    </td>
                    <td>{product.stock}</td>
                    <td>
                      <input type="number" id={product.name + "-stock-input"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="supplier-operations">
            <h4 style={{ textAlign: "center" }}>Operations</h4>
            <div className="change-operations">
              <button onClick={onAddToStocks}>Add to Stocks</button>
              <button onClick={onPriceChanges}>Change Prices</button>
            </div>
            <button className="reset-button" onClick={onReset}>
              Reset
            </button>
            <div className="collected-money-container">
              <div className="collected-money">{collectedMoney} Units</div>
              <div>
                <button onClick={onCollectMoney}>Collect Money</button>
              </div>
            </div>
          </div>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SupplierPanel;
