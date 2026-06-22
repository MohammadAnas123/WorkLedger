import { Plus, Trash2 } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { fmt } from "../../utils/format";

export default function MaterialsTab({ materials, onAdd, onDelete }) {
  return (
    <div className="wl-tab-panel">
      <div className="wl-tab-panel-head">
        <p>Every item bought for this job, with real price and your commission.</p>
        <button className="wl-btn wl-btn-primary sm" onClick={onAdd}>
          <Plus size={16} /> Add material
        </button>
      </div>

      {materials.length === 0 ? (
        <EmptyState
          title="No materials added yet"
          subtitle="Add what you buy from the shop, item by item."
        />
      ) : (
        <div className="wl-ledger-table">
          <div className="wl-ledger-row wl-ledger-head">
            <span>Item</span>
            <span>Shop</span>
            <span className="num">Qty</span>
            <span className="num">Real price</span>
            <span className="num">Commission</span>
            <span className="num">Customer price</span>
            <span></span>
          </div>
          {materials.map((m) => (
            <div className="wl-ledger-row" key={m.id}>
              <span className="wl-ledger-primary">{m.itemName}</span>
              <span className="wl-ledger-muted">{m.shopName || "—"}</span>
              <span className="num">{m.quantity} {m.unit}</span>
              <span className="num">{fmt(m.realPrice)}</span>
              <span className="num accent-green">{fmt(m.commission)}</span>
              <span className="num wl-ledger-strong">{fmt(Number(m.realPrice) + Number(m.commission))}</span>
              <button className="wl-row-delete" onClick={() => onDelete(m.id)} aria-label="Remove">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
