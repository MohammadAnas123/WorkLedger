import { useState } from "react";
import { ArrowLeft, User, Phone, MapPin, FileText, CheckCircle2 } from "lucide-react";
import { WORK_TYPES } from "../constants/workTypes";
import { createClient } from "../api/clients";

/* ─────────────────────────── styles ─────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  :root {
    --bg-base:        #111827;
    --bg-card:        #1F2937;
    --bg-card-hover:  #263041;
    --bg-elevated:    #374151;
    --border:         #374151;
    --border-focus:   #F59E0B;
    --text-primary:   #F9FAFB;
    --text-secondary: #9CA3AF;
    --text-muted:     #6B7280;
    --amber:          #F59E0B;
    --amber-dim:      #78350F;
    --amber-bg:       #1C1100;
    --green:          #34D399;
    --green-bg:       #011C14;
    --rose:           #FB7185;
    --rose-bg:        #1C0009;
    --rose-dim:       #881337;
    --radius-sm:      8px;
    --radius-md:      12px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ncf-root {
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--bg-base);
    color: var(--text-primary);
    min-height: 100vh;
    padding-bottom: env(safe-area-inset-bottom, 32px);
  }

  /* ── top bar ── */
  .ncf-topbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    background: #0D1420;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .ncf-back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
  }
  .ncf-back:hover { background: var(--bg-elevated); color: var(--text-primary); }
  .ncf-topbar-text { flex: 1; }
  .ncf-topbar-text h2 {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .ncf-topbar-text p {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 1px;
  }

  /* ── body ── */
  .ncf-body {
    max-width: 560px;
    margin: 0 auto;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  @media (min-width: 600px) {
    .ncf-body { padding: 32px 24px; }
  }

  /* ── section card ── */
  .ncf-section {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }
  .ncf-section-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .ncf-section-head svg { color: var(--amber); }

  /* ── field ── */
  .ncf-field {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .ncf-field + .ncf-field {
    border-top: 1px solid var(--border);
  }
  .ncf-field-inner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
    height: 52px;
  }
  .ncf-field-icon {
    color: var(--text-muted);
    flex-shrink: 0;
    width: 16px;
  }
  .ncf-field-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding: 8px 0;
    min-width: 0;
  }
  .ncf-field-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
    line-height: 1;
    margin-bottom: 3px;
  }
  .ncf-field-input {
    background: none;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    font-family: inherit;
    width: 100%;
  }
  .ncf-field-input::placeholder { color: var(--text-muted); font-weight: 400; }

  /* textarea field */
  .ncf-field-textarea-wrap {
    padding: 14px 16px;
  }
  .ncf-field-textarea {
    width: 100%;
    background: none;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    font-family: inherit;
    resize: none;
    line-height: 1.6;
    min-height: 72px;
  }
  .ncf-field-textarea::placeholder { color: var(--text-muted); font-weight: 400; }

  /* error */
  .ncf-error {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: var(--rose);
    padding: 6px 16px 8px 42px;
    background: var(--rose-bg);
    border-top: 1px solid var(--rose-dim);
  }

  /* focus ring on section when a child is focused */
  .ncf-section:focus-within {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 2px var(--amber-bg);
  }
  /* but not when the worktype grid or notes section is focused */
  .ncf-section-noFocus:focus-within {
    border-color: var(--border);
    box-shadow: none;
  }

  /* ── work type grid ── */
  .ncf-worktype-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 14px;
  }
  @media (min-width: 400px) {
    .ncf-worktype-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .ncf-worktype-opt {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    background: var(--bg-base);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    text-align: left;
  }
  .ncf-worktype-opt:hover {
    background: var(--bg-card-hover);
    color: var(--text-primary);
  }
  .ncf-worktype-opt.active {
    background: color-mix(in srgb, var(--opt-color) 12%, transparent);
    border-color: color-mix(in srgb, var(--opt-color) 45%, transparent);
    color: var(--opt-color);
  }
  .ncf-worktype-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-elevated);
    flex-shrink: 0;
    transition: background 0.15s;
  }
  .ncf-worktype-opt.active .ncf-worktype-icon {
    background: color-mix(in srgb, var(--opt-color) 18%, transparent);
  }

  /* ── form actions ── */
  .ncf-actions {
    display: flex;
    gap: 10px;
  }
  .ncf-btn-cancel {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 0 20px;
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .ncf-btn-cancel:hover { background: var(--bg-elevated); color: var(--text-primary); }

  .ncf-btn-submit {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 48px;
    border-radius: var(--radius-sm);
    background: var(--amber);
    border: none;
    color: #1C1100;
    font-size: 14px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: filter 0.15s, transform 0.1s;
  }
  .ncf-btn-submit:hover:not(:disabled) { filter: brightness(1.1); }
  .ncf-btn-submit:active:not(:disabled) { transform: scale(0.98); }
  .ncf-btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* saving spinner */
  .ncf-spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: #1C1100;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

/* ─────────────────────────── component ─────────────────────────── */
export default function NewClientForm({ goto, onCreated }) {
  const [form, setForm] = useState({
    name: "", phone: "", address: "", workType: "interior", notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Client name is required";
    if (form.phone && !/^\d{7,15}$/.test(form.phone.replace(/\s+/g, "")))
      e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const c = await createClient(form);
    setSaving(false);
    onCreated(c);
  };

  return (
    <div className="ncf-root">
      <style>{css}</style>

      {/* ── sticky top bar ── */}
      <div className="ncf-topbar">
        <button className="ncf-back" onClick={() => goto("dashboard")}>
          <ArrowLeft size={16} />
        </button>
        <div className="ncf-topbar-text">
          <h2>New client</h2>
          <p>What's the job, and who's it for?</p>
        </div>
      </div>

      <form onSubmit={submit}>
        <div className="ncf-body">

          {/* ── contact details ── */}
          <div className="ncf-section">
            <div className="ncf-section-head">
              <User size={13} /> Client details
            </div>

            <div className="ncf-field">
              <div className="ncf-field-inner">
                <User size={15} className="ncf-field-icon" />
                <div className="ncf-field-wrap">
                  <div className="ncf-field-label">Full name *</div>
                  <input
                    className="ncf-field-input"
                    autoFocus
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Rakesh Verma"
                  />
                </div>
              </div>
              {errors.name && (
                <div className="ncf-error">{errors.name}</div>
              )}
            </div>

            <div className="ncf-field">
              <div className="ncf-field-inner">
                <Phone size={15} className="ncf-field-icon" />
                <div className="ncf-field-wrap">
                  <div className="ncf-field-label">Phone number</div>
                  <input
                    className="ncf-field-input"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="e.g. 9876543210"
                    inputMode="numeric"
                  />
                </div>
              </div>
              {errors.phone && (
                <div className="ncf-error">{errors.phone}</div>
              )}
            </div>

            <div className="ncf-field">
              <div className="ncf-field-inner">
                <MapPin size={15} className="ncf-field-icon" />
                <div className="ncf-field-wrap">
                  <div className="ncf-field-label">Address</div>
                  <input
                    className="ncf-field-input"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="e.g. Gomti Nagar, Lucknow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── work type ── */}
          <div className="ncf-section ncf-section-noFocus">
            <div className="ncf-section-head">
              <CheckCircle2 size={13} /> Type of work
            </div>
            <div className="ncf-worktype-grid">
              {WORK_TYPES.map((w) => {
                const Icon = w.icon;
                return (
                  <button
                    type="button"
                    key={w.key}
                    className={"ncf-worktype-opt" + (form.workType === w.key ? " active" : "")}
                    style={{ "--opt-color": w.color }}
                    onClick={() => set("workType", w.key)}
                  >
                    <div className="ncf-worktype-icon">
                      <Icon size={15} />
                    </div>
                    <span>{w.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── notes ── */}
          <div className="ncf-section ncf-section-noFocus">
            <div className="ncf-section-head">
              <FileText size={13} /> Job notes
            </div>
            <div className="ncf-field-textarea-wrap">
              <textarea
                className="ncf-field-textarea"
                rows={3}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="e.g. False ceiling + wall paneling in living room"
              />
            </div>
          </div>

          {/* ── actions ── */}
          <div className="ncf-actions">
            <button type="button" className="ncf-btn-cancel" onClick={() => goto("dashboard")}>
              Cancel
            </button>
            <button type="submit" className="ncf-btn-submit" disabled={saving}>
              {saving
                ? <><div className="ncf-spinner" /> Adding…</>
                : <><CheckCircle2 size={15} /> Add client</>}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}