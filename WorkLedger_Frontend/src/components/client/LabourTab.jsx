import { Plus, Trash2 } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { fmt } from "../../utils/format";

export default function LabourTab({ labour, onAdd, onDelete }) {
  return (
    <div className="wl-tab-panel">
      <div className="wl-tab-panel-head">
        <p>Labour charges added once work is done.</p>
        <button className="wl-btn wl-btn-primary sm" onClick={onAdd}>
          <Plus size={16} /> Add labour charge
        </button>
      </div>

      {labour.length === 0 ? (
        <EmptyState
          title="No labour charges yet"
          subtitle="Add this once the work is finished."
        />
      ) : (
        <div className="wl-ledger-table labour">
          <div className="wl-ledger-row wl-ledger-head">
            <span>Description</span>
            <span>Date</span>
            <span className="num">Amount</span>
            <span></span>
          </div>
          {labour.map((l) => (
            <div className="wl-ledger-row" key={l.id}>
              <span className="wl-ledger-primary">{l.description}</span>
              <span className="wl-ledger-muted">{l.date}</span>
              <span className="num wl-ledger-strong">{fmt(l.amount)}</span>
              <button className="wl-row-delete" onClick={() => onDelete(l.id)} aria-label="Remove">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
