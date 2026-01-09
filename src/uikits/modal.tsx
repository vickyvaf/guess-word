import { useEffect } from "react";
import { Button } from "./button";

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
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(90vw, 560px)",
          background: "white",
          border: "3px solid black",
          borderRadius: "1rem",
          boxShadow: "8px 8px 0 rgba(0,0,0,0.25)",
          padding: "1rem 1.25rem",
          color: "#213547",
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
              border: "2px solid black",
              background: "white",
              borderRadius: "0.5rem",
              padding: "0.25rem 0.5rem",
              boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
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
