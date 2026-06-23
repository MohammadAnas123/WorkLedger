import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Printer, CheckCircle } from "lucide-react";
import LoadingState from "../components/layout/LoadingState";
import { workTypeMeta } from "../constants/workTypes";
import { fmt } from "../utils/format";
import { todayISO } from "../utils/date";
import { materialTotals, labourTotal } from "../utils/calculations";
import { getClient } from "../api/clients";
import { listMaterials } from "../api/materials";
import { listLabour } from "../api/labour";
import { nextReceiptNo } from "../api/receipt";

/* ─────────────────────────── styles ─────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  :root {
    --bg-base:        #111827;
    --bg-card:        #1F2937;
    --border:         #374151;
    --text-primary:   #F9FAFB;
    --text-secondary: #9CA3AF;
    --text-muted:     #6B7280;
    --amber:          #F59E0B;
    --amber-dim:      #78350F;
    --amber-bg:       #1C1100;
    --green:          #34D399;
    --green-bg:       #011C14;
    --green-dim:      #064E3B;
    --radius-sm:      8px;
    --radius-md:      12px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── screen shell ── */
  .rv-root {
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--bg-base);
    color: var(--text-primary);
    min-height: 100vh;
    padding-bottom: env(safe-area-inset-bottom, 32px);
  }

  /* ── top bar ── */
  .rv-topbar {
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
  .rv-back {
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
  .rv-back:hover { background: #374151; color: var(--text-primary); }
  .rv-topbar-title {
    flex: 1;
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .rv-print-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 36px;
    padding: 0 16px;
    border-radius: var(--radius-sm);
    background: var(--amber);
    border: none;
    color: #1C1100;
    font-size: 13px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: filter 0.15s, transform 0.1s;
    white-space: nowrap;
  }
  .rv-print-btn:hover  { filter: brightness(1.1); }
  .rv-print-btn:active { transform: scale(0.97); }

  /* ── paper wrapper ── */
  .rv-stage {
    padding: 24px 16px 40px;
    display: flex;
    justify-content: center;
  }
  @media (min-width: 640px) {
    .rv-stage { padding: 40px 24px 60px; }
  }

  /* ── the receipt paper ── */
  .rv-paper {
    width: 100%;
    max-width: 580px;
    background: #FAFAF8;
    color: #1a1a1a;
    border-radius: 4px;
    box-shadow:
      0 2px 4px rgba(0,0,0,0.3),
      0 8px 24px rgba(0,0,0,0.5),
      0 0 0 1px rgba(0,0,0,0.15);
    overflow: hidden;
    position: relative;
  }

  /* amber top stripe */
  .rv-stripe {
    height: 5px;
    background: linear-gradient(90deg, #F59E0B 0%, #FBBF24 50%, #D97706 100%);
  }

  /* ── receipt header ── */
  .rv-head {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 14px;
    padding: 20px 24px 18px;
    border-bottom: 1px solid #E5E4E0;
  }

  .rv-brandmark {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #1a1a1a;
    color: #F59E0B;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: -0.05em;
    flex-shrink: 0;
  }

  .rv-head-brand h2 {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #111;
    line-height: 1.2;
  }
  .rv-head-brand p {
    font-size: 11px;
    color: #888;
    margin-top: 2px;
  }

  .rv-receipt-meta {
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .rv-receipt-no-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #999;
  }
  .rv-receipt-no-value {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #111;
  }
  .rv-receipt-date {
    font-size: 11px;
    color: #888;
  }

  /* ── bill to / work info ── */
  .rv-bill-to {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: #E5E4E0;
    border-bottom: 1px solid #E5E4E0;
  }
  .rv-bill-cell {
    background: #FAFAF8;
    padding: 14px 24px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .rv-bill-cell:first-child {
    border-right: 1px solid #E5E4E0;
  }
  .rv-bill-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #999;
  }
  .rv-bill-name {
    font-size: 14px;
    font-weight: 700;
    color: #111;
    margin-top: 2px;
  }
  .rv-bill-detail {
    font-size: 12px;
    color: #555;
    line-height: 1.5;
  }

  /* ── sections ── */
  .rv-section {
    padding: 16px 24px 0;
  }
  .rv-section + .rv-section {
    padding-top: 0;
  }
  .rv-section-title {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #999;
    padding: 14px 0 8px;
    border-top: 1px solid #E5E4E0;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .rv-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #E5E4E0;
  }

  /* ── receipt table ── */
  .rv-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .rv-table thead tr {
    border-bottom: 1px solid #E5E4E0;
  }
  .rv-table th {
    padding: 6px 0 8px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #aaa;
    text-align: left;
  }
  .rv-table th.rv-num,
  .rv-table td.rv-num { text-align: right; }
  .rv-table tbody tr {
    border-bottom: 1px solid #F0EFEB;
  }
  .rv-table tbody tr:last-child { border-bottom: none; }
  .rv-table td {
    padding: 9px 0;
    color: #222;
    line-height: 1.4;
  }
  .rv-table td:last-child { font-weight: 600; white-space: nowrap; }
  .rv-table .rv-qty { color: #777; font-size: 12px; }

  /* subtotal row */
  .rv-subtotal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0 16px;
    font-size: 12px;
    color: #777;
    border-top: 1px solid #E5E4E0;
    margin-top: 2px;
  }
  .rv-subtotal strong { color: #333; font-weight: 700; }

  /* ── grand total ── */
  .rv-grand {
    margin: 0 24px;
    border-top: 2px solid #1a1a1a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
  }
  .rv-grand-label {
    font-size: 13px;
    font-weight: 700;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .rv-grand-value {
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: #111;
  }

  /* ── paid stamp ── */
  .rv-footer {
    margin: 0 24px;
    padding: 16px 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #E5E4E0;
  }
  .rv-footer-thanks {
    font-size: 12px;
    color: #888;
    line-height: 1.5;
  }
  .rv-paid-stamp {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    border: 2px solid #16a34a;
    border-radius: 6px;
    padding: 6px 14px;
    transform: rotate(-3deg);
    opacity: 0.85;
  }
  .rv-paid-stamp svg { color: #16a34a; }
  .rv-paid-text {
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.15em;
    color: #16a34a;
  }

  /* ── perforated bottom edge ── */
  .rv-perf {
    height: 12px;
    background: repeating-linear-gradient(
      90deg,
      #FAFAF8 0px, #FAFAF8 10px,
      transparent 10px, transparent 14px
    );
    border-top: 1px dashed #D1D0CC;
    margin-top: 4px;
  }

  /* ════════ PRINT ════════ */
  @media print {
    .rv-topbar { display: none !important; }
    .rv-root    { background: white; }
    .rv-stage   { padding: 0; background: white; }
    .rv-paper   {
      max-width: 100%;
      box-shadow: none;
      border-radius: 0;
    }
    .rv-grand-value { font-size: 20px; }
  }
`;

/* ─────────────────────────── component ─────────────────────────── */
export default function ReceiptView({ clientId, goto }) {
  const [client, setClient]       = useState(null);
  const [materials, setMaterials] = useState([]);
  const [labour, setLabour]       = useState([]);
  const [receiptNo, setReceiptNo] = useState("");

  useEffect(() => {
    (async () => {
      const [c, mats, lab, rno] = await Promise.all([
        getClient(clientId),
        listMaterials(clientId),
        listLabour(clientId),
        nextReceiptNo(clientId),
      ]);
      setClient(c);
      setMaterials(mats);
      setLabour(lab);
      setReceiptNo(rno);
    })();
  }, [clientId]);

  if (!client) return <LoadingState />;

  const mt    = materialTotals(materials);
  const lt    = labourTotal(labour);
  const grand = mt.customer + lt;

  return (
    <div className="rv-root">
      <style>{css}</style>

      {/* ── top bar ── */}
      <div className="rv-topbar no-print">
        <button className="rv-back" onClick={() => goto("client", { id: clientId })}>
          <ArrowLeft size={16} />
        </button>
        <span className="rv-topbar-title">Receipt preview</span>
        <button className="rv-print-btn" onClick={() => window.print()}>
          <Printer size={14} /> Print / Save PDF
        </button>
      </div>

      {/* ── paper stage ── */}
      <div className="rv-stage">
        <div className="rv-paper">
          <div className="rv-stripe" />

          {/* header */}
          <div className="rv-head">
            <div className="rv-brandmark">WL</div>
            <div className="rv-head-brand">
              <h2>Work Ledger</h2>
              <p>Interior &amp; General Maintenance Services</p>
            </div>
            <div className="rv-receipt-meta">
              <span className="rv-receipt-no-label">Receipt</span>
              <span className="rv-receipt-no-value">{receiptNo}</span>
              <span className="rv-receipt-date">{todayISO()}</span>
            </div>
          </div>

          {/* bill to */}
          <div className="rv-bill-to">
            <div className="rv-bill-cell">
              <span className="rv-bill-label">Billed to</span>
              <div className="rv-bill-name">{client.name}</div>
              {client.address && <div className="rv-bill-detail">{client.address}</div>}
              {client.phone   && <div className="rv-bill-detail">{client.phone}</div>}
            </div>
            <div className="rv-bill-cell">
              <span className="rv-bill-label">Scope of work</span>
              <div className="rv-bill-name">{workTypeMeta(client.workType).label}</div>
              {client.notes && <div className="rv-bill-detail">{client.notes}</div>}
            </div>
          </div>

          {/* materials */}
          {materials.length > 0 && (
            <div className="rv-section">
              <div className="rv-section-title">Materials</div>
              <table className="rv-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="rv-num">Qty</th>
                    <th className="rv-num">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m) => (
                    <tr key={m.id}>
                      <td>{m.itemName}</td>
                      <td className="rv-num rv-qty">{m.quantity} {m.unit}</td>
                      <td className="rv-num">{fmt(Number(m.realPrice) + Number(m.commission))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="rv-subtotal">
                <span>Materials subtotal</span>
                <strong>{fmt(mt.customer)}</strong>
              </div>
            </div>
          )}

          {/* labour */}
          {labour.length > 0 && (
            <div className="rv-section">
              <div className="rv-section-title">Labour</div>
              <table className="rv-table">
                <tbody>
                  {labour.map((l) => (
                    <tr key={l.id}>
                      <td>{l.description}</td>
                      <td className="rv-num">{fmt(l.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="rv-subtotal">
                <span>Labour subtotal</span>
                <strong>{fmt(lt)}</strong>
              </div>
            </div>
          )}

          {/* grand total */}
          <div className="rv-grand">
            <span className="rv-grand-label">Total payable</span>
            <span className="rv-grand-value">{fmt(grand)}</span>
          </div>

          {/* footer */}
          <div className="rv-footer">
            <p className="rv-footer-thanks">
              Thank you for trusting us<br />with your work.
            </p>
            <div className="rv-paid-stamp">
              <CheckCircle size={14} />
              <span className="rv-paid-text">PAID</span>
            </div>
          </div>

          <div className="rv-perf" />
        </div>
      </div>
    </div>
  );
}