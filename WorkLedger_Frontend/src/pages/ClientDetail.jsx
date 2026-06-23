import { useEffect, useState } from "react";
import { Phone, MapPin, Calendar, Check, Ban, RotateCcw, Package, Hammer, Printer } from "lucide-react";
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

export default function ClientDetail({ clientId, goto, showToast, onClientChanged }) {
  const [client, setClient] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [labour, setLabour] = useState([]);
  const [tab, setTab] = useState("materials");
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showLabourModal, setShowLabourModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [togglingStatus, setTogglingStatus] = useState(false);

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

  useEffect(() => {
    load();
  }, [clientId]);

  if (loading || !client) return <LoadingState />;

  const meta = workTypeMeta(client.workType);
  const Icon = meta.icon;
  const mt = materialTotals(materials);
  const lt = labourTotal(labour);
  const grandTotal = mt.customer + lt;
  const isCancelled = client.status === "cancelled";
  const isCompleted = client.status === "completed";

  const toggleCompleted = async () => {
    setTogglingStatus(true);
    await updateClient(clientId, { status: isCompleted ? "in_progress" : "completed" });
    await load();
    onClientChanged();
    setTogglingStatus(false);
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
    <div className="wl-page">
      {isCancelled && (
        <div className="wl-cancel-banner">
          <Ban size={18} />
          <div>
            <strong>This job is closed — {cancelReasonLabel(client.cancelReason)}</strong>
            {client.cancelNote && <p>{client.cancelNote}</p>}
            <span className="wl-cancel-date">Closed on {client.cancelledAt}</span>
          </div>
          <button className="wl-btn wl-btn-ghost sm" onClick={reopenJob}>
            <RotateCcw size={14} /> Reopen
          </button>
        </div>
      )}

      <div className="wl-client-header">
        <div className="wl-client-header-left">
          <span className="wl-worktype-tag lg" style={{ "--tag-color": meta.color }}>
            <Icon size={16} /> {meta.label}
          </span>
          <h2>{client.name}</h2>
          <div className="wl-client-meta">
            {client.phone && (
              <span><Phone size={14} /> {client.phone}</span>
            )}
            {client.address && (
              <span><MapPin size={14} /> {client.address}</span>
            )}
            <span><Calendar size={14} /> Since {client.createdAt}</span>
          </div>
          {client.notes && <p className="wl-client-job-notes">{client.notes}</p>}
        </div>
        {!isCancelled && (
          <div className="wl-client-header-right">
            {!isCompleted && (
              <button className="wl-btn wl-btn-danger-outline" onClick={() => setShowCancelModal(true)}>
                <Ban size={16} /> Close job
              </button>
            )}
            <button
              className={"wl-btn " + (isCompleted ? "wl-btn-primary" : "wl-btn-secondary")}
              onClick={toggleCompleted}
              disabled={togglingStatus}
              style={{ minWidth: 170, opacity: togglingStatus ? 0.85 : 1 }}
            >
              {togglingStatus ? (
                <>
                  {isCompleted ? "Reopening" : "Marking completed"} <DotsLoader />
                </>
              ) : (
                <>
                  {isCompleted ? <RotateCcw size={16} /> : <Check size={16} />}
                  {isCompleted ? "Reopen job" : "Mark completed"}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="wl-summary-strip">
        <SummaryPill label="Material cost" value={fmt(mt.real)} />
        <SummaryPill label="Your commission" value={fmt(mt.commission)} accent="green" />
        <SummaryPill label="Labour charge" value={fmt(lt)} />
        <SummaryPill label="Customer total" value={fmt(grandTotal)} accent="rust" big />
      </div>

      <div className="wl-tabs">
        <button className={"wl-tab" + (tab === "materials" ? " active" : "")} onClick={() => setTab("materials")}>
          <Package size={16} /> Materials <span className="wl-tab-count">{materials.length}</span>
        </button>
        <button className={"wl-tab" + (tab === "labour" ? " active" : "")} onClick={() => setTab("labour")}>
          <Hammer size={16} /> Labour <span className="wl-tab-count">{labour.length}</span>
        </button>
        <button className="wl-tab wl-tab-print" onClick={() => goto("receipt", { id: clientId })}>
          <Printer size={16} /> View / print receipt
        </button>
      </div>

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