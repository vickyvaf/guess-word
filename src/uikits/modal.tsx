import { useEffect } from "react";
import { Button } from "@/uikits/button";

export function Modal({
  open,
  onClose,
  children,
  title = "Settings",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--modal-overlay)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(90vw, 560px)",
          background: "var(--modal-bg)",
          border: "3px solid var(--modal-border)",
          borderRadius: "1rem",
          boxShadow: "8px 8px 0 var(--modal-shadow)",
          padding: "1rem 1.25rem",
          color: "var(--modal-text)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.5rem", lineHeight: 1.2 }}>
            {title}
          </h2>
          <Button
            onClick={onClose}
            aria-label="Close"
            style={{
              cursor: "pointer",
              border: "2px solid var(--modal-border)",
              background: "var(--modal-bg)",
              borderRadius: "0.5rem",
              padding: "0.25rem 0.5rem",
              boxShadow: "3px 3px 0 var(--modal-shadow)",
              fontSize: "1.25rem",
            }}
          >
            ✕
          </Button>
        </div>

        <div style={{ marginTop: "1rem" }}>{children}</div>
      </div>
    </div>
  );
}
