import { useState } from "react";
import ModalShell from "../common/ModalShell";
import { fmt } from "../../utils/format";

export default function AddMaterialModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    itemName: "", shopName: "", quantity: 1, unit: "pcs", realPrice: "", commission: "",
  });
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const customerPrice = (Number(form.realPrice) || 0) + (Number(form.commission) || 0);

  const save = (e) => {
    e.preventDefault();
    if (!form.itemName.trim()) return setError("Item name is required");
    if (!form.realPrice || Number(form.realPrice) <= 0) return setError("Enter the real price you paid");
    onSave({
      itemName: form.itemName.trim(),
      shopName: form.shopName.trim(),
      quantity: Number(form.quantity) || 1,
      unit: form.unit,
      realPrice: Number(form.realPrice),
      commission: Number(form.commission) || 0,
    });
  };

  return (
    <ModalShell title="Add material" onClose={onClose}>
      <form className="wl-form" onSubmit={save}>
        <label className="wl-field">
          <span>Item name *</span>
          <input
            autoFocus
            value={form.itemName}
            onChange={(e) => set("itemName", e.target.value)}
            placeholder="e.g. PVC Ceiling Panel"
          />
        </label>

        <label className="wl-field">
          <span>Shop name</span>
          <input
            value={form.shopName}
            onChange={(e) => set("shopName", e.target.value)}
            placeholder="e.g. Sharma Hardware"
          />
        </label>

        <div className="wl-field-row">
          <label className="wl-field">
            <span>Quantity</span>
            <input
              type="number" min="0" step="any"
              value={form.quantity}
              onChange={(e) => set("quantity", e.target.value)}
            />
          </label>
          <label className="wl-field">
            <span>Unit</span>
            <select value={form.unit} onChange={(e) => set("unit", e.target.value)}>
              {["pcs", "ft", "kg", "m", "set", "box", "litre"].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="wl-field-row">
          <label className="wl-field">
            <span>Real price (what you paid) *</span>
            <input
              type="number" min="0" inputMode="decimal"
              value={form.realPrice}
              onChange={(e) => set("realPrice", e.target.value)}
              placeholder="0"
            />
          </label>
          <label className="wl-field">
            <span>Your commission</span>
            <input
              type="number" min="0" inputMode="decimal"
              value={form.commission}
              onChange={(e) => set("commission", e.target.value)}
              placeholder="0"
            />
          </label>
        </div>

        <div className="wl-calc-preview">
          <span>Customer will be charged</span>
          <strong>{fmt(customerPrice)}</strong>
        </div>

        {error && <span className="wl-error">{error}</span>}

        <div className="wl-form-actions">
          <button type="button" className="wl-btn wl-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="wl-btn wl-btn-primary">Add to job</button>
        </div>
      </form>
    </ModalShell>
  );
}
