import { X } from "lucide-react";

export default function ModalShell({ title, onClose, children }) {
  return (
    <div className="wl-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="wl-modal">
        <div className="wl-modal-head">
          <h3>{title}</h3>
          <button className="wl-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
