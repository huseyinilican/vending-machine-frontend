import { useEffect, useRef, useState } from "react";
import { Product } from "../types";
import ProductService from "../services/ProductService";
import MachineSettingsService from "../services/MachineSettingsService";

type Props = {
  onClose: () => void;
  products: Product[] | undefined;
  setProducts: React.Dispatch<React.SetStateAction<Product[] | undefined>>;
  collectedMoney: number;
  setCollectedMoney: React.Dispatch<React.SetStateAction<number>>;
};

export default function SupplierPanel({
  onClose,
  products,
  setProducts,
  collectedMoney,
  setCollectedMoney,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [drafts, setDrafts] = useState<
    Record<string, { price: string; stock: string }>
  >(
    Object.fromEntries(
      (products ?? []).map((product) => [
        product.id,
        { price: String(product.price), stock: "" },
      ]),
    ),
  );
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    element?.showModal();
    return () => {
      element?.close();
      previousFocus?.focus();
    };
  }, []);
  const updateDraft = (id: string, field: "price" | "stock", value: string) =>
    setDrafts((previous) => ({
      ...previous,
      [id]: { ...previous[id], [field]: value },
    }));
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const updates = (products ?? []).map((product) => ({
        ...product,
        price: Number(drafts[product.id].price),
        stock: product.stock + Number(drafts[product.id].stock || 0),
      }));
      const { data } = await ProductService.updateProducts(updates);
      setProducts(data);
      setDrafts(
        Object.fromEntries(
          data.map((product: Product) => [
            product.id,
            { price: String(product.price), stock: "" },
          ]),
        ),
      );
      setMessage("Inventory updated.");
    } catch {
      setMessage("Could not save inventory. Please try again.");
    } finally {
      setPending(false);
    }
  };
  const collect = async () => {
    setPending(true);
    try {
      const { data } = await MachineSettingsService.getMachineSettings();
      await MachineSettingsService.updateMachineSettingsWithKey({
        ...data,
        collectedMoney: data.collectedMoney + collectedMoney,
      });
      setCollectedMoney(0);
      setMessage("Session earnings collected.");
    } catch {
      setMessage("Could not collect earnings. Please try again.");
    } finally {
      setPending(false);
    }
  };
  return (
    <dialog
      ref={dialog}
      className="supplier-dialog"
      aria-labelledby="supplier-title"
      onCancel={onClose}
    >
      <div className="dialog-heading">
        <div>
          <p className="eyebrow">MACHINE MANAGEMENT</p>
          <h2 id="supplier-title">Supplier panel</h2>
        </div>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close supplier panel"
        >
          ×
        </button>
      </div>
      <p className="dialog-copy">Update prices and restock your selection.</p>
      <form onSubmit={(event) => void save(event)}>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Drink</th>
                <th>Price · units</th>
                <th>In stock</th>
                <th>Add stock</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.name}</th>
                  <td>
                    <input
                      aria-label={product.name + " price"}
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={drafts[product.id]?.price ?? ""}
                      onChange={(event) =>
                        updateDraft(product.id, "price", event.target.value)
                      }
                    />
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <input
                      aria-label={"Add stock for " + product.name}
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={drafts[product.id]?.stock ?? ""}
                      onChange={(event) =>
                        updateDraft(product.id, "stock", event.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dialog-actions">
          <span role="status">{message}</span>
          <button
            className="primary-button"
            disabled={pending || !products?.length}
            type="submit"
          >
            {pending ? "Working…" : "Save inventory"}
          </button>
        </div>
      </form>
      <div className="earnings-row">
        <div>
          <span>Session earnings</span>
          <strong>
            {collectedMoney} <small>units</small>
          </strong>
        </div>
        <button
          className="secondary-button"
          disabled={pending || !collectedMoney}
          onClick={() => void collect()}
        >
          Collect earnings
        </button>
      </div>
    </dialog>
  );
}
