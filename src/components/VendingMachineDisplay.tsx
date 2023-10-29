import React, { useEffect, useState } from "react";
import ProductSelection from "./ProductSelection";
import TransactionHistory from "./TransactionHistory";
import { Product, Transaction } from "../types";
import TransactionService from "../services/TransactionService";

type VendingMachineDisplayProps = {
  products?: Product[];
};

const VendingMachineDisplay: React.FC<VendingMachineDisplayProps> = ({
  products,
}) => {
  const [balance, setBalance] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    TransactionService.getAllTransactions().then((response) => {
      if (response.data.length > 0) {
        setTransactions(response.data);
      }
    });
  }, []);

  const handleProductSelection = (product: Product) => {
    setSelectedProduct(product);
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
        }
      );
    }
  };

  return (
    <div className="vending-machine">
      <div className="display-section">
        <h2>Vending Machine</h2>
        <div>
          <p>Balance: {balance} units</p>
          {selectedProduct && <p>Selected Product: {selectedProduct.name}</p>}
        </div>
        <button onClick={handleRefund} disabled={balance === 0}>
          Refund
        </button>
      </div>

      <div className="product-selection-section">
        <ProductSelection
          products={products}
          onSelectProduct={handleProductSelection}
          balance={balance}
        />
      </div>

      <div className="money-insertion-section">
        <h3>Insert Money:</h3>
        <button onClick={() => handleMoneyInsertion(1)}>1 unit</button>
        <button onClick={() => handleMoneyInsertion(5)}>5 units</button>
        <button onClick={() => handleMoneyInsertion(10)}>10 units</button>
        <button onClick={() => handleMoneyInsertion(20)}>20 units</button>
        <button onClick={() => handleMoneyInsertion(20)}>20 units</button>
      </div>

      <div className="transaction-history-section">
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
};

export default VendingMachineDisplay;
