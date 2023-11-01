import React, { useEffect, useState } from "react";
import ProductSelection from "./ProductSelection";
import TransactionHistory from "./TransactionHistory";
import { Product, Transaction } from "../types";
import TransactionService from "../services/TransactionService";
import ProductService from "../services/ProductService";
import SupplierPanel from "./SupplierPanel";
import "./VendingMachineDisplay.css";

const VendingMachineDisplay: React.FC = () => {
  const [products, setProducts] = useState<Product[]>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [change, setChange] = useState(0);
  const [collectedMoney, setCollectedMoney] = useState(0);

  const [showSupplierPanel, setShowSupplierPanel] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  useEffect(() => {
    TransactionService.getAllTransactions()
      .then((response) => {
        if (response.data.length > 0) {
          setTransactions(response.data);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });

    ProductService.getAllProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleProductSelection = (product: Product) => {
    const transaction: Transaction = {
      insertedMoney: balance,
      change: balance - product.price,
      timeStamp: new Date().toLocaleString(),
      product: product,
    };
    TransactionService.createTransaction(transaction).then((response) => {
      setTransactions([...transactions, response.data]);
      const newProducts = products?.map((product) => {
        if (product.name === response.data.product?.name) {
          return (product = response.data.product);
        }
        return product;
      });

      setProducts(newProducts);
      setBalance(0);
      setChange(response.data.change);
      setCollectedMoney(
        collectedMoney + (response.data.insertedMoney - response.data.change)
      );
    });
  };

  const handleMoneyInsertion = (money: number) => {
    setBalance(balance + money);
  };

  const handleRefund = () => {
    if (balance > 0) {
      const refundTransaction: Transaction = {
        insertedMoney: balance,
        change: balance,
        timeStamp: new Date().toLocaleString(),
      };
      TransactionService.createTransaction(refundTransaction).then(
        (response) => {
          setTransactions([...transactions, response.data]);
          setBalance(0);
          setChange(response.data.change);
        }
      );
    }
  };

  const openSupplierPanel = () => {
    setShowSupplierPanel(true);
  };

  const closeSupplierPanel = () => {
    setShowSupplierPanel(false);
  };

  return (
    <div className="vending-machine-container">
      <h1>Vending Machine</h1>

      <div className="vending-machine">
        <div className="product-selection-section">
          <ProductSelection
            products={products}
            onSelectProduct={handleProductSelection}
            balance={balance}
          />
        </div>

        <div className="money-insertion-section">
          <h3>Insert Money</h3>
          <div className="coins">
            <button onClick={() => handleMoneyInsertion(1)}>1 unit</button>
            <button onClick={() => handleMoneyInsertion(5)}>5 units</button>
            <button onClick={() => handleMoneyInsertion(10)}>10 units</button>
            <button onClick={() => handleMoneyInsertion(20)}>20 units</button>
          </div>

          <div className="unit-related-information">
            <div className="format">
              <h3>Available Units</h3>
              <div className="balance">{balance}</div>
            </div>

            <div className="format">
              <h3>Change</h3>
              <div className="change">{change}</div>
            </div>
          </div>

          <div className="refund">
            <button className="refund-button" onClick={handleRefund}>
              Refund
            </button>
          </div>
        </div>
      </div>

      <div className="extra-interactions-section">
        <button
          className="transaction-history-button"
          onClick={() => setShowTransactionHistory(!showTransactionHistory)}
        >
          Show Transaction History
        </button>
        <button onClick={openSupplierPanel}>Open Supplier Panel</button>
      </div>

      {showTransactionHistory && (
        <div className="transaction-history-section">
          <TransactionHistory transactions={transactions} />
        </div>
      )}

      {showSupplierPanel && (
        <SupplierPanel
          onClose={closeSupplierPanel}
          products={products}
          setProducts={setProducts}
          collectedMoney={collectedMoney}
          setCollectedMoney={setCollectedMoney}
        />
      )}
    </div>
  );
};

export default VendingMachineDisplay;
