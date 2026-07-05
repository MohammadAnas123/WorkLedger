import { useState } from "react";
import ModalShell from "../common/ModalShell";

export default function AddLabourModal({ onClose, onSave }) {
  const [form, setForm] = useState({ description: "", amount: "", labourType: "self" });
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = (e) => {
    e.preventDefault();
    if (!form.description.trim()) return setError("Add a short description");
    if (!form.amount || Number(form.amount) <= 0) return setError("Enter the labour amount");
    onSave({ description: form.description.trim(), amount: Number(form.amount), labourType: form.labourType });
  };

  return (
    <ModalShell title="Add labour charge" onClose={onClose}>
      <form className="wl-form" onSubmit={save}>
        <label className="wl-field">
          <span>Description *</span>
          <input
            autoFocus
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="e.g. Ceiling installation labour, 3 days"
          />
        </label>
        <label className="wl-field">
          <span>Amount *</span>
          <input
            type="number" min="0" inputMode="decimal"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            placeholder="0"
          />
        </label>
        <label className="wl-field">
          <span>Labour type *</span>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <input
                type="radio"
                name="labourType"
                value="self"
                checked={form.labourType === "self"}
                onChange={() => set("labourType", "self")}
              />
              Self
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <input
                type="radio"
                name="labourType"
                value="hired"
                checked={form.labourType === "hired"}
                onChange={() => set("labourType", "hired")}
              />
              Hired
            </label>
          </div>
        </label>
        {error && <span className="wl-error">{error}</span>}
        <div className="wl-form-actions">
          <button type="button" className="wl-btn wl-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="wl-btn wl-btn-primary">Add</button>
        </div>
      </form>
    </ModalShell>
  );
}
