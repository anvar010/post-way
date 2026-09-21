"use client";

export default function ConfirmDialog({ open, title, body, confirmLabel = "Delete", onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="overlay overlay--dialog">
      <div className="backdrop" onClick={onCancel} />
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title">{title}</h2>
        <p>{body}</p>
        <div className="dialog-actions">
          <button className="btn btn--outline btn--half" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn--danger btn--half" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
