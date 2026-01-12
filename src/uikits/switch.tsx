import { useSettings } from "@/contexts/SettingsContext";
import { useEffect, useRef } from "react";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  style?: React.CSSProperties;
};

export function Switch({ checked, onChange, label, style }: SwitchProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume } = useSettings();

  useEffect(() => {
    audioRef.current = new Audio("/casual-click-pop-ui.mp3");
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const playSound = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Align label and switch
        cursor: "pointer",
        userSelect: "none",
        border: "4px solid var(--button-border)",
        borderRadius: "0.5rem",
        padding: "0.75rem", // Match button padding
        backgroundColor: "var(--input-bg)",
        boxShadow: "4px 4px 0 var(--button-shadow)",
        boxSizing: "border-box", // Fix overflow
        ...style,
      }}
      onClick={() => {
        playSound();
        onChange(!checked);
      }}
    >
      {label && (
        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginRight: "1rem",
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          width: "3.5rem",
          height: "2rem",
          backgroundColor: checked ? "#4caf50" : "#ccc",
          borderRadius: "1rem",
          position: "relative",
          transition: "background-color 0.2s ease",
          border: "2px solid var(--button-border)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: checked ? "calc(100% - 1.9rem)" : "0.3rem",
            transform: "translateY(-50%)",
            width: "1.4rem",
            height: "1.4rem",
            backgroundColor: "#fff",
            borderRadius: "50%",
            border: "2px solid var(--button-border)",
            transition: "left 0.2s ease",
            boxShadow: "1px 1px 0 rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </div>
  );
}
