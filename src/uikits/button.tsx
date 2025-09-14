type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  fontSize?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
};

export function Button({
  children,
  onClick,
  fontSize = "3rem",
  style,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={() => {
        new Audio("/casual-click-pop-ui.mp3").play();
        onClick?.();
      }}
      style={{
        width: "fit-content",
        fontFamily: "inherit",
        margin: 0,
        fontSize,
        lineHeight: 1.1,
        cursor: "pointer",
        border: "4px solid black",
        padding: "1rem 3rem",
        borderRadius: "0.5em",
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
      {children}
    </button>
  );
}
