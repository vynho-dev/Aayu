import { useEffect } from "react";

import { Icon } from "./Icon";

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  pending,
  error,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  pending: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      role="presentation"
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(4, 44, 44, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-4)",
        zIndex: 50,
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={(event) => event.stopPropagation()}
        className="aayu-card"
        style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 16, boxShadow: "var(--elevation-2)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--aayu-danger-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="trash" size={18} color="var(--aayu-danger)" />
          </span>
          <h2 id="confirm-dialog-title" className="aayu-text-h2" style={{ fontWeight: 500, color: "var(--aayu-ink-900)" }}>{title}</h2>
        </div>
        <p id="confirm-dialog-message" className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)" }}>{message}</p>
        {error && <p role="alert" className="aayu-text-body-sm" style={{ color: "var(--aayu-danger)" }}>{error}</p>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="aayu-text-body-sm"
            style={{
              padding: "10px 16px",
              borderRadius: "var(--radius-sm)",
              border: "0.5px solid var(--aayu-border)",
              background: "var(--aayu-surface-card)",
              color: "var(--aayu-text-primary)",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="aayu-text-body-sm"
            style={{
              padding: "10px 16px",
              borderRadius: "var(--radius-sm)",
              border: 0,
              background: "var(--aayu-danger)",
              color: "#fff",
              fontWeight: 500,
            }}
          >
            {pending ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
