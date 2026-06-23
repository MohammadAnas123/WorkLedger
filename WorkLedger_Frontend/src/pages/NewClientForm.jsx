import { useState } from "react";
import { WORK_TYPES } from "../constants/workTypes";
import { createClient } from "../api/clients";

export default function NewClientForm({ goto, onCreated }) {
  const [form, setForm] = useState({
    name: "", phone: "", address: "", workType: "interior", notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Client name is required";
    if (form.phone && !/^\d{7,15}$/.test(form.phone.replace(/\s+/g, "")))
      e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const c = await createClient(form);
    setSaving(false);
    onCreated(c);
  };

  return (
    <div className="wl-page wl-narrow">
      <h2 className="wl-page-title">New client</h2>
      <p className="wl-page-sub">What's the job, and who's it for?</p>

      <form className="wl-form" onSubmit={submit}>
        <label className="wl-field">
          <span>Client name *</span>
          <input
            autoFocus
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Rakesh Verma"
          />
          {errors.name && <span className="wl-error">{errors.name}</span>}
        </label>

        <label className="wl-field">
          <span>Phone number</span>
          <input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="e.g. 9876543210"
            inputMode="numeric"
          />
          {errors.phone && <span className="wl-error">{errors.phone}</span>}
        </label>

        <label className="wl-field">
          <span>Address</span>
          <input
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="e.g. Gomti Nagar, Lucknow"
          />
        </label>

        <div className="wl-field">
          <span>Type of work</span>
          <div className="wl-worktype-grid">
            {WORK_TYPES.map((w) => {
              const Icon = w.icon;
              return (
                <button
                  type="button"
                  key={w.key}
                  className={"wl-worktype-opt" + (form.workType === w.key ? " active" : "")}
                  style={{ "--opt-color": w.color }}
                  onClick={() => set("workType", w.key)}
                >
                  <Icon size={18} />
                  <span>{w.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="wl-field">
          <span>What needs to be done?</span>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="e.g. False ceiling + wall paneling in living room"
          />
        </label>

        <div className="wl-form-actions">
          <button type="button" className="wl-btn wl-btn-ghost" onClick={() => goto("dashboard")}>
            Cancel
          </button>
          <button type="submit" className="wl-btn wl-btn-primary" disabled={saving}>
            {saving ? "Adding…" : "Add client"}
          </button>
        </div>
      </form>
    </div>
  );
}
