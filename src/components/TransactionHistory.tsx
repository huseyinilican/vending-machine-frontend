import { Transaction } from "../types";

export default function TransactionHistory({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <section className="activity-panel" aria-labelledby="activity-title">
      <div className="section-heading">
        <h2 id="activity-title">Recent activity</h2>
        <span>{transactions.length} transactions</span>
      </div>
      {!transactions.length ? (
        <p className="empty-state">
          Your purchases and returns will appear here.
        </p>
      ) : (
        <div className="activity-list">
          {[...transactions].reverse().map((transaction, index) => (
            <div className="activity-entry" key={transaction.id ?? index}>
              <span className="activity-icon" aria-hidden="true">
                {transaction.product ? "↗" : "↩"}
              </span>
              <div>
                <strong>
                  {transaction.product?.name ?? "Balance returned"}
                </strong>
                <p>{transaction.timeStamp}</p>
              </div>
              <div className="activity-amount">
                <strong>
                  {transaction.insertedMoney - transaction.change} units
                </strong>
                <p>{transaction.change} units returned</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
