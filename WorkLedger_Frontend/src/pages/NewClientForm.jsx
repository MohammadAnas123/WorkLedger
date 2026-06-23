import { useState } from "react";
import { WORK_TYPES } from "../constants/workTypes";
import { createClient } from "../api/clients";

function DotsLoader() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "currentColor",
            opacity: 0.9,
            animation: "wl-dot-bounce 1s ease-in-out infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes wl-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

// Strip country code (+91 / 0091), spaces, dashes, dots, parentheses — then check digits
const normalizePhone = (raw) =>
  raw
    .trim()
    .replace(/^(\+|00)91/, "")   // strip +91 or 0091
    .replace(/[\s\-().]/g, "");  // strip separators

const validatePhone = (raw) => {
  if (!raw.trim()) return null; // optional field
  const digits = normalizePhone(raw);
  if (!/^\d+$/.test(digits)) return "Phone number should contain digits only";
  if (digits.length < 7 || digits.length > 12) return "Enter a valid phone number (7–12 digits)";
  return null;
};

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
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) e.phone = phoneErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    // Save normalized phone so +91 / spaces don't persist in DB
    const payload = { ...form, phone: form.phone ? normalizePhone(form.phone) : "" };
    const c = await createClient(payload);
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
          <button
            type="submit"
            className="wl-btn wl-btn-primary"
            disabled={saving}
            style={{ minWidth: 120, opacity: saving ? 0.85 : 1 }}
          >
            {saving ? <> Adding <DotsLoader /> </> : "Add client"}
          </button>
        </div>
      </form>
    </div>
  );
}