import { useEffect, useState } from "react";
import { ChevronRight, Ban } from "lucide-react";
import { workTypeMeta } from "../../constants/workTypes";
import { cancelReasonLabel } from "../../constants/cancelReasons";
import { fmt } from "../../utils/format";
import { materialTotals, labourTotal } from "../../utils/calculations";
import { listMaterials } from "../../api/materials";
import { listLabour } from "../../api/labour";

export default function ClientCard({ client, onOpen }) {
  const meta = workTypeMeta(client.workType);
  const Icon = meta.icon;
  const [totals, setTotals] = useState(null);
  const isCancelled = client.status === "cancelled";

  useEffect(() => {
    (async () => {
      const [mats, lab] = await Promise.all([listMaterials(client.id), listLabour(client.id)]);
      const mt = materialTotals(mats);
      setTotals({ amount: mt.customer + labourTotal(lab) });
    })();
  }, [client.id]);

  return (
    <button className={"wl-client-card" + (isCancelled ? " is-cancelled" : "")} onClick={onOpen}>
      <div className="wl-client-card-top">
        <span className="wl-worktype-tag" style={{ "--tag-color": meta.color }}>
          <Icon size={13} /> {meta.label}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span className={"wl-status-dot " + client.status} />
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: client.status === "completed" ? "var(--green)"
                 : client.status === "in_progress" ? "var(--rust)"
                 : client.status === "cancelled" ? "#B23A2E"
                 : "var(--stone)",
            textTransform: "capitalize",
          }}>
            {client.status.replace("_", " ")}
          </span>
        </span>
      </div>
      <h3>{client.name}</h3>
      {isCancelled ? (
        <p className="wl-client-cancel-note">
          <Ban size={13} /> Closed — {cancelReasonLabel(client.cancelReason)}
        </p>
      ) : (
        <p className="wl-client-note">{client.notes || "No notes added"}</p>
      )}
      <div className="wl-client-card-foot">
        <span className="wl-client-amount">{totals ? fmt(totals.amount) : "…"}</span>
        <ChevronRight size={18} />
      </div>
    </button>
  );
}