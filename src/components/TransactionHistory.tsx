import React from "react";
import { Transaction } from "../types";

type TransactionHistoryProps = {
  transactions: Transaction[];
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
}) => {
  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            Product: {transaction.product?.name}
            <br />
            Inserted Money: {transaction.insertedMoney} units
            <br />
            Change Given: {transaction.change} units
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
