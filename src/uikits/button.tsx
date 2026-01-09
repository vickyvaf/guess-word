import { useEffect, useRef } from "react";
import { useSettings } from "../contexts/SettingsContext";

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  fontSize?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  icon?: React.ReactNode;
  rounded?: boolean;
};

export function Button({
  children,
  onClick,
  fontSize = "3rem",
  style,
  disabled = false,
  rounded = false,
  icon,
}: ButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume } = useSettings();

  useEffect(() => {
    audioRef.current = new Audio("/casual-click-pop-ui.mp3");
  }, []);

  // Apply volume from settings
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
    <button
      disabled={disabled}
      onClick={() => {
        playSound();
        onClick?.();
      }}
      style={{
        borderRadius: rounded ? "100%" : "0.5em",
        width: "fit-content",
        height: "fit-content",
        fontFamily: "inherit",
        margin: 0,
        fontSize: icon ? undefined : fontSize,
        lineHeight: 1.1,
        cursor: "pointer",
        border: "4px solid black",
        padding: rounded ? "0.5rem" : "1rem 3rem",
        backgroundColor: "white",
        boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
        userSelect: "none",
        transition: "transform 0.1s ease",
        ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {icon ? icon : children}
    </button>
  );
}
