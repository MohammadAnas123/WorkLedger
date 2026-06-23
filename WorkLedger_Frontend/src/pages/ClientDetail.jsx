import { useEffect, useState } from "react";
import {
  Phone, MapPin, Calendar, Check, Ban, RotateCcw,
  Package, Hammer, Printer, ChevronRight, AlertCircle,
  TrendingUp, DollarSign, Wrench, FileText,
} from "lucide-react";
import SummaryPill from "../components/common/SummaryPill";
import LoadingState from "../components/layout/LoadingState";
import MaterialsTab from "../components/client/MaterialsTab";
import LabourTab from "../components/client/LabourTab";
import AddMaterialModal from "../components/client/AddMaterialModal";
import AddLabourModal from "../components/client/AddLabourModal";
import CloseJobModal from "../components/client/CloseJobModal";
import { workTypeMeta } from "../constants/workTypes";
import { cancelReasonLabel } from "../constants/cancelReasons";
import { fmt } from "../utils/format";
import { todayISO } from "../utils/date";
import { materialTotals, labourTotal } from "../utils/calculations";
import { getClient, updateClient } from "../api/clients";
import { listMaterials, addMaterial, deleteMaterial } from "../api/materials";
import { listLabour, addLabour, deleteLabour } from "../api/labour";

/* ─────────────────────────── styles ─────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  :root {
    --bg-base:        #111827;
    --bg-card:        #1F2937;
    --bg-card-hover:  #263041;
    --bg-elevated:    #374151;
    --border:         #374151;
    --border-subtle:  #1F2937;
    --text-primary:   #F9FAFB;
    --text-secondary: #9CA3AF;
    --text-muted:     #6B7280;
    --amber:          #F59E0B;
    --amber-dim:      #78350F;
    --amber-bg:       #1C1100;
    --green:          #34D399;
    --green-dim:      #064E3B;
    --green-bg:       #011C14;
    --rose:           #FB7185;
    --rose-dim:       #881337;
    --rose-bg:        #1C0009;
    --blue:           #60A5FA;
    --blue-bg:        #0C1C35;
    --radius-sm:      8px;
    --radius-md:      12px;
    --radius-lg:      16px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cd-root {
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--bg-base);
    color: var(--text-primary);
    min-height: 100vh;
    padding: 0 0 env(safe-area-inset-bottom, 24px);
  }

  /* ── cancel banner ── */
  .cd-cancel-banner {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: var(--rose-bg);
    border-bottom: 1px solid var(--rose-dim);
    padding: 14px 16px;
    color: var(--rose);
    font-size: 13px;
    line-height: 1.5;
  }
  .cd-cancel-banner svg { flex-shrink: 0; margin-top: 2px; }
  .cd-cancel-banner strong { display: block; font-weight: 600; }
  .cd-cancel-banner p { color: var(--text-secondary); margin-top: 2px; }
  .cd-cancel-date { color: var(--text-muted); font-size: 11px; }
  .cd-cancel-reopen {
    margin-left: auto;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: 1px solid var(--rose-dim);
    color: var(--rose);
    border-radius: var(--radius-sm);
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;
  }
  .cd-cancel-reopen:hover { background: var(--rose-dim); }

  /* ── hero header ── */
  .cd-header {
    padding: 20px 16px 0;
    background: linear-gradient(180deg, #0F1724 0%, var(--bg-base) 100%);
  }
  .cd-worktype-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid;
    margin-bottom: 10px;
  }
  .cd-name {
    font-size: clamp(22px, 5vw, 30px);
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: 10px;
  }
  .cd-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }
  .cd-meta span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .cd-meta a {
    color: var(--blue);
    text-decoration: none;
  }
  .cd-notes {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 10px 12px;
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.55;
    margin-bottom: 14px;
  }

  /* ── action buttons ── */
  .cd-actions {
    display: flex;
    gap: 8px;
    padding-bottom: 20px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .cd-actions::-webkit-scrollbar { display: none; }
  .cd-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    transition: filter 0.15s, transform 0.1s;
    flex-shrink: 0;
  }
  .cd-btn:active { transform: scale(0.97); }
  .cd-btn-complete {
    background: var(--green);
    color: #011C14;
  }
  .cd-btn-reopen {
    background: var(--bg-elevated);
    color: var(--text-secondary);
  }
  .cd-btn-close {
    background: var(--rose-bg);
    color: var(--rose);
    border: 1px solid var(--rose-dim);
  }
  .cd-btn:hover { filter: brightness(1.1); }

  /* ── summary strip ── */
  .cd-summary {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 0 16px 20px;
  }
  @media (min-width: 600px) {
    .cd-summary { grid-template-columns: repeat(4, 1fr); }
  }
  .cd-pill {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 14px 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: background 0.15s;
  }
  .cd-pill:hover { background: var(--bg-card-hover); }
  .cd-pill-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .cd-pill-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }
  .cd-pill-value {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .cd-pill-sub {
    font-size: 10px;
    color: var(--text-muted);
    margin-top: 2px;
  }
  .cd-pill-amber .cd-pill-icon  { background: var(--amber-bg); color: var(--amber); }
  .cd-pill-amber .cd-pill-value { color: var(--amber); }
  .cd-pill-green .cd-pill-icon  { background: var(--green-bg); color: var(--green); }
  .cd-pill-green .cd-pill-value { color: var(--green); }
  .cd-pill-blue .cd-pill-icon   { background: var(--blue-bg); color: var(--blue); }
  .cd-pill-blue .cd-pill-value  { color: var(--blue); }
  .cd-pill-rose .cd-pill-icon   { background: var(--rose-bg); color: var(--rose); }
  .cd-pill-rose .cd-pill-value  { color: var(--rose); }
  .cd-pill-grand {
    grid-column: span 2;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #1C1100, #2D1A00);
    border-color: var(--amber-dim);
  }
  @media (min-width: 600px) {
    .cd-pill-grand { grid-column: span 1; flex-direction: column; align-items: flex-start; }
  }
  .cd-pill-grand .cd-pill-value { font-size: clamp(22px, 5vw, 28px); }

  /* ── profit margin badge ── */
  .cd-margin-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 999px;
    background: var(--green-bg);
    color: var(--green);
    border: 1px solid var(--green-dim);
  }

  /* ── tabs ── */
  .cd-tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    padding: 0 16px;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .cd-tabs::-webkit-scrollbar { display: none; }
  .cd-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s, border-color 0.15s;
    margin-bottom: -1px;
  }
  .cd-tab:hover { color: var(--text-secondary); }
  .cd-tab.active {
    color: var(--amber);
    border-bottom-color: var(--amber);
  }
  .cd-tab-count {
    background: var(--bg-elevated);
    color: var(--text-secondary);
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 999px;
    min-width: 20px;
    text-align: center;
  }
  .cd-tab.active .cd-tab-count {
    background: var(--amber-bg);
    color: var(--amber);
  }
  .cd-tab-print {
    margin-left: auto;
    color: var(--blue);
  }
  .cd-tab-print:hover { color: var(--blue); opacity: 0.8; }

  /* ── tab content ── */
  .cd-tab-body {
    padding: 16px;
  }

  /* ── status completed overlay ── */
  .cd-completed-banner {
    margin: 0 16px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--green-bg);
    border: 1px solid var(--green-dim);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    font-size: 13px;
    color: var(--green);
    font-weight: 600;
  }

  /* ── quick info strip (desktop) ── */
  @media (min-width: 768px) {
    .cd-header {
      padding: 28px 28px 0;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 24px;
      align-items: start;
    }
    .cd-actions { padding-bottom: 28px; }
    .cd-summary { padding: 0 28px 24px; }
    .cd-tabs { padding: 0 28px; }
    .cd-tab-body { padding: 24px 28px; }
    .cd-cancel-banner { padding: 16px 28px; }
    .cd-completed-banner { margin: 0 28px 16px; }
  }
`;

/* ─────────────────────────── component ─────────────────────────── */
export default function ClientDetail({ clientId, goto, showToast, onClientChanged }) {
  const [client, setClient] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [labour, setLabour] = useState([]);
  const [tab, setTab] = useState("materials");
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showLabourModal, setShowLabourModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [c, mats, lab] = await Promise.all([
      getClient(clientId),
      listMaterials(clientId),
      listLabour(clientId),
    ]);
    setClient(c);
    setMaterials(mats);
    setLabour(lab);
    setLoading(false);
  };

  useEffect(() => { load(); }, [clientId]);

  if (loading || !client) return <LoadingState />;

  const meta = workTypeMeta(client.workType);
  const Icon = meta.icon;
  const mt = materialTotals(materials);
  const lt = labourTotal(labour);
  const grandTotal = mt.customer + lt;
  const margin = grandTotal > 0 ? Math.round((mt.commission / grandTotal) * 100) : 0;
  const isCancelled = client.status === "cancelled";
  const isCompleted = client.status === "completed";

  const toggleCompleted = async () => {
    await updateClient(clientId, { status: isCompleted ? "in_progress" : "completed" });
    await load();
    onClientChanged();
  };

  const reopenJob = async () => {
    await updateClient(clientId, {
      status: "in_progress",
      cancelReason: null,
      cancelNote: null,
      cancelledAt: null,
    });
    await load();
    onClientChanged();
    showToast("Job reopened");
  };

  const closeJob = async ({ reason, note }) => {
    await updateClient(clientId, {
      status: "cancelled",
      cancelReason: reason,
      cancelNote: note,
      cancelledAt: todayISO(),
    });
    setShowCancelModal(false);
    await load();
    onClientChanged();
    showToast("Job closed");
  };

  return (
    <div className="cd-root">
      <style>{css}</style>

      {/* ── cancelled banner ── */}
      {isCancelled && (
        <div className="cd-cancel-banner">
          <AlertCircle size={18} />
          <div>
            <strong>Job closed — {cancelReasonLabel(client.cancelReason)}</strong>
            {client.cancelNote && <p>{client.cancelNote}</p>}
            <span className="cd-cancel-date">Closed {client.cancelledAt}</span>
          </div>
          <button className="cd-cancel-reopen" onClick={reopenJob}>
            <RotateCcw size={13} /> Reopen
          </button>
        </div>
      )}

      {/* ── header ── */}
      <div className="cd-header">
        <div>
          <span
            className="cd-worktype-tag"
            style={{ color: meta.color, borderColor: meta.color + "44", background: meta.color + "18" }}
          >
            <Icon size={13} /> {meta.label}
          </span>
          <h2 className="cd-name">{client.name}</h2>
          <div className="cd-meta">
            {client.phone && (
              <span>
                <Phone size={13} />
                <a href={`tel:${client.phone}`}>{client.phone}</a>
              </span>
            )}
            {client.address && (
              <span><MapPin size={13} /> {client.address}</span>
            )}
            <span><Calendar size={13} /> Since {client.createdAt}</span>
          </div>
          {client.notes && <p className="cd-notes">{client.notes}</p>}

          {/* ── action buttons ── */}
          {!isCancelled && (
            <div className="cd-actions">
              <button
                className={"cd-btn " + (isCompleted ? "cd-btn-reopen" : "cd-btn-complete")}
                onClick={toggleCompleted}
              >
                <Check size={15} />
                {isCompleted ? "Mark in progress" : "Mark completed"}
              </button>
              <button className="cd-btn cd-btn-close" onClick={() => setShowCancelModal(true)}>
                <Ban size={15} /> Close job
              </button>
              <button className="cd-btn cd-btn-reopen" onClick={() => goto("receipt", { id: clientId })}>
                <Printer size={15} /> Receipt
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── completed badge ── */}
      {isCompleted && !isCancelled && (
        <div className="cd-completed-banner">
          <Check size={16} /> Job marked as completed
        </div>
      )}

      {/* ── summary cards ── */}
      <div className="cd-summary">
        <div className="cd-pill cd-pill-amber">
          <div className="cd-pill-icon"><DollarSign size={14} /></div>
          <div className="cd-pill-label">Material cost</div>
          <div className="cd-pill-value">{fmt(mt.real)}</div>
          <div className="cd-pill-sub">{materials.length} item{materials.length !== 1 ? "s" : ""}</div>
        </div>

        <div className="cd-pill cd-pill-green">
          <div className="cd-pill-icon"><TrendingUp size={14} /></div>
          <div className="cd-pill-label">Your commission</div>
          <div className="cd-pill-value">{fmt(mt.commission)}</div>
          {margin > 0 && (
            <div className="cd-pill-sub">
              <span className="cd-margin-badge"><TrendingUp size={9} /> {margin}% margin</span>
            </div>
          )}
        </div>

        <div className="cd-pill cd-pill-blue">
          <div className="cd-pill-icon"><Wrench size={14} /></div>
          <div className="cd-pill-label">Labour charge</div>
          <div className="cd-pill-value">{fmt(lt)}</div>
          <div className="cd-pill-sub">{labour.length} entr{labour.length !== 1 ? "ies" : "y"}</div>
        </div>

        <div className="cd-pill cd-pill-rose cd-pill-grand">
          <div>
            <div className="cd-pill-icon"><FileText size={14} /></div>
            <div className="cd-pill-label">Customer total</div>
          </div>
          <div className="cd-pill-value">{fmt(grandTotal)}</div>
        </div>
      </div>

      {/* ── tabs ── */}
      <div className="cd-tabs">
        <button
          className={"cd-tab" + (tab === "materials" ? " active" : "")}
          onClick={() => setTab("materials")}
        >
          <Package size={15} /> Materials
          <span className="cd-tab-count">{materials.length}</span>
        </button>
        <button
          className={"cd-tab" + (tab === "labour" ? " active" : "")}
          onClick={() => setTab("labour")}
        >
          <Hammer size={15} /> Labour
          <span className="cd-tab-count">{labour.length}</span>
        </button>
        {isCancelled && (
          <button className="cd-tab cd-tab-print" onClick={() => goto("receipt", { id: clientId })}>
            <Printer size={15} /> Receipt <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* ── tab body ── */}
      <div className="cd-tab-body">
        {tab === "materials" && (
          <MaterialsTab
            materials={materials}
            onAdd={() => setShowMaterialModal(true)}
            onDelete={async (id) => {
              await deleteMaterial(id);
              showToast("Material removed");
              load();
            }}
          />
        )}
        {tab === "labour" && (
          <LabourTab
            labour={labour}
            onAdd={() => setShowLabourModal(true)}
            onDelete={async (id) => {
              await deleteLabour(id);
              showToast("Labour entry removed");
              load();
            }}
          />
        )}
      </div>

      {/* ── modals ── */}
      {showMaterialModal && (
        <AddMaterialModal
          onClose={() => setShowMaterialModal(false)}
          onSave={async (payload) => {
            await addMaterial(clientId, payload);
            setShowMaterialModal(false);
            showToast("Material added");
            load();
          }}
        />
      )}
      {showLabourModal && (
        <AddLabourModal
          onClose={() => setShowLabourModal(false)}
          onSave={async (payload) => {
            await addLabour(clientId, payload);
            setShowLabourModal(false);
            showToast("Labour charge added");
            load();
          }}
        />
      )}
      {showCancelModal && (
        <CloseJobModal
          onClose={() => setShowCancelModal(false)}
          onSave={closeJob}
        />
      )}
    </div>
  );
}