import React from "react";
import { Transaction } from "../types";
import "./TransactionHistory.css";

type TransactionHistoryProps = {
  transactions: Transaction[];
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
}) => {
  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      <div className="transaction-history-list">
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction-entry">
            <div>
              {transaction.product
                ? `Bought ${transaction.product.name}`
                : "Refunded"}
            </div>
            <div>Inserted: {transaction.insertedMoney} units</div>
            <div>Change: {transaction.change} units</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
