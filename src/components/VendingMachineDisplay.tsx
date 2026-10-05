import { useEffect, useState } from "react";
import ProductSelection from "./ProductSelection";
import TransactionHistory from "./TransactionHistory";
import SupplierPanel from "./SupplierPanel";
import { Product, Transaction } from "../types";
import TransactionService from "../services/TransactionService";
import ProductService from "../services/ProductService";

export default function VendingMachineDisplay() {
  const [products, setProducts] = useState<Product[]>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [change, setChange] = useState(0);
  const [collectedMoney, setCollectedMoney] = useState(0);
  const [supplier, setSupplier] = useState(false);
  const [activity, setActivity] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    ProductService.getAllProducts()
      .then(({ data }) => setProducts(data))
      .catch(() =>
        setError(
          "Could not load the drinks. Check your connection and refresh.",
        ),
      );
    TransactionService.getAllTransactions()
      .then(({ data }) => setTransactions(data))
      .catch(() =>
        setError(
          "Activity could not be loaded. You can still browse the drinks.",
        ),
      );
  }, []);

  const transact = async (product?: Product) => {
    if (pending || balance === 0) return;
    setPending(true);
    setError("");
    try {
      const { data } = await TransactionService.createTransaction({
        insertedMoney: balance,
        change: product ? balance - product.price : balance,
        timeStamp: new Date().toLocaleString(),
        product,
      });
      setTransactions((previous) => [...previous, data]);
      if (data.product) {
        setProducts((previous) =>
          previous?.map((item) =>
            item.id === data.product?.id ? data.product : item,
          ),
        );
        setCollectedMoney(
          (previous) => previous + data.insertedMoney - data.change,
        );
      }
      setBalance(0);
      setChange(data.change);
      setMessage(
        product
          ? "Enjoy your " + product.name + "! Your change is ready below."
          : "Your balance has been returned.",
      );
    } catch {
      setError(
        "That transaction could not be completed. Your balance is still available. Please try again.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Refresh home">
          <span className="brand-mark">r.</span>refresh
          <span className="brand-dot">●</span>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={activity ? "nav-button active" : "nav-button"}
            onClick={() => setActivity(!activity)}
            aria-expanded={activity}
          >
            Activity
          </button>
          <button className="nav-button" onClick={() => setSupplier(true)}>
            Supplier panel <span aria-hidden="true">↗</span>
          </button>
        </nav>
      </header>
      <main>
        <section className="intro">
          <div>
            <p className="eyebrow">A LITTLE BREAK, WELL SPENT</p>
            <h1>
              Something fresh.
              <br />
              <span>Just a tap away.</span>
            </h1>
            <p className="intro-copy">
              Pick your drink, add a little credit, and enjoy the moment.
            </p>
          </div>
          <span className="machine-status">
            <span />
            Ready to serve
          </span>
        </section>
        {error && (
          <div className="notice error" role="alert">
            {error}
          </div>
        )}
        {message && (
          <div className="notice" role="status">
            {message}
          </div>
        )}
        <div className="shop-layout">
          <section className="catalog" aria-labelledby="catalog-title">
            <div className="section-heading">
              <h2 id="catalog-title">On the menu</h2>
              <span>{products?.length ?? "—"} drinks · always chilled</span>
            </div>
            <ProductSelection
              products={products}
              balance={balance}
              pending={pending}
              onSelectProduct={(product) => void transact(product)}
            />
            <p className="catalog-note">
              <span aria-hidden="true">↗</span> Add credit to unlock your pick.
              Any extra is returned as change.
            </p>
          </section>
          <aside className="payment-panel" aria-labelledby="payment-title">
            <div className="section-heading">
              <h2 id="payment-title">Your credit</h2>
              <span className="step-label">STEP 01 / 02</span>
            </div>
            <div className="balance-display" aria-live="polite">
              <span>Available balance</span>
              <div>
                {balance}
                <small>units</small>
              </div>
              <p>
                {pending
                  ? "Completing your transaction…"
                  : balance
                    ? "You're ready. Choose a drink."
                    : "Add credit to get started."}
              </p>
            </div>
            <p className="field-label">ADD CREDIT</p>
            <div className="credit-buttons">
              {[1, 5, 10, 20].map((amount) => (
                <button
                  key={amount}
                  disabled={pending}
                  onClick={() => {
                    setBalance((value) => value + amount);
                    setMessage("");
                  }}
                >
                  +{amount}
                  <small>units</small>
                </button>
              ))}
            </div>
            <button
              className="refund-button"
              disabled={!balance || pending}
              onClick={() => void transact()}
            >
              Return balance <span aria-hidden="true">↩</span>
            </button>
            <div className="change-row" aria-live="polite">
              <span>Last change returned</span>
              <strong>
                {change} <small>units</small>
              </strong>
            </div>
            <div className="payment-help">
              <span>i</span>
              <p>
                This is a demo machine. Credit uses virtual units, so no real
                payment is needed.
              </p>
            </div>
          </aside>
        </div>
        {activity && <TransactionHistory transactions={transactions} />}
      </main>
      <footer>
        <span>refresh · a small everyday pleasure</span>
        <span>Take a break. Stay refreshed.</span>
      </footer>
      {supplier && (
        <SupplierPanel
          onClose={() => setSupplier(false)}
          products={products}
          setProducts={setProducts}
          collectedMoney={collectedMoney}
          setCollectedMoney={setCollectedMoney}
        />
      )}
    </div>
  );
}
