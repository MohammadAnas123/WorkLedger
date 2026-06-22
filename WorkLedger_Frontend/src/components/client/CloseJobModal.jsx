import { useState } from "react";
import { Ban } from "lucide-react";
import ModalShell from "../common/ModalShell";
import { CANCEL_REASONS } from "../../constants/cancelReasons";

export default function CloseJobModal({ onClose, onSave }) {
  const [reason, setReason] = useState("client_refused");
  const [note, setNote] = useState("");

  const save = (e) => {
    e.preventDefault();
    onSave({ reason, note: note.trim() });
  };

  return (
    <ModalShell title="Close this job" onClose={onClose}>
      <form className="wl-form" onSubmit={save}>
        <p className="wl-modal-intro">
          This will not delete anything you already added — materials and labour entries stay on
          record, but the job moves out of your active list and will not count toward revenue or profit.
        </p>

        <div className="wl-field">
          <span>Why is this job closing?</span>
          <div className="wl-reason-list">
            {CANCEL_REASONS.map((r) => (
              <button
                type="button"
                key={r.key}
                className={"wl-reason-opt" + (reason === r.key ? " active" : "")}
                onClick={() => setReason(r.key)}
              >
                <span className="wl-reason-radio">{reason === r.key && <span />}</span>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <label className="wl-field">
          <span>Note (optional)</span>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Client's brother-in-law is doing it instead"
          />
        </label>

        <div className="wl-form-actions">
          <button type="button" className="wl-btn wl-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="wl-btn wl-btn-danger">
            <Ban size={15} /> Close job
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
