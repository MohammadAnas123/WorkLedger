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
        <span className={"wl-status-dot " + client.status} />
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
