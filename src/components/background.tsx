import { useEffect, useState } from "react";

export function MathGridBg({
  cell = 32,
  major = 160,
}: {
  cell?: number;
  major?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger animasi ketika pertama kali render
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const style = {
    width: "100vw",
    height: "100vh",
    position: "absolute" as const,
    inset: 0,
    zIndex: -10,
    backgroundImage: `
      linear-gradient(to right, rgba(59,130,246,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(59,130,246,0.05) 1px, transparent 1px),
      linear-gradient(to right, rgba(37,99,235,0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(37,99,235,0.1) 1px, transparent 1px)
    `,
    backgroundSize: `
      ${cell}px ${cell}px,
      ${cell}px ${cell}px,
      ${major}px ${major}px,
      ${major}px ${major}px
    `,
    clipPath: visible
      ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
      : "polygon(0 0, 0 0, 0 0, 0 0)",
    transition: "clip-path 1s ease-out",
  } as const;

  return <div style={style} />;
}
