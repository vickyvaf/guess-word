import { useEffect, useRef } from "react";

export function HealthPoint({ health = 5 }: { health?: number }) {
  const MAX = 5;
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const prevHealth = useRef<number>(health);

  useEffect(() => {
    // Jika health berkurang, animasikan hati yang baru mati: index = health
    if (prevHealth.current > health) {
      const idx = Math.max(0, Math.min(MAX - 1, health));
      const el = imgRefs.current[idx];
      if (el) {
        el.animate(
          [
            { transform: "translateX(0) scale(1)", opacity: 1 },
            { transform: "translateX(-4px) scale(0.98)", opacity: 0.95 },
            { transform: "translateX(4px) scale(0.96)", opacity: 0.9 },
            { transform: "translateX(-3px) scale(0.95)", opacity: 0.9 },
            { transform: "translateX(3px) scale(0.95)", opacity: 0.9 },
            { transform: "translateX(0) scale(0.95)", opacity: 0.9 },
          ],
          { duration: 400, easing: "ease-out" }
        );
      }
    }
    prevHealth.current = health;
  }, [health]);

  return (
    <div
      style={{
        display: "flex",
        gap: "0.4rem",
        position: "absolute",
        top: 30,
        left: "50%",
        transform: "translateX(-50%)",
        userSelect: "none",
      }}
    >
      {[...Array(MAX)].map((_, i) => {
        const isAlive = i < health; // kiri → kanan
        return (
          <img
            key={i}
            // @ts-ignore
            ref={(el) => (imgRefs.current[i] = el)}
            src={isAlive ? "/red-heart.png" : "/gray-heart.png"}
            alt="Health Point"
            width={50}
            height={50}
            style={{
              transition:
                "filter 200ms ease, transform 200ms ease, opacity 200ms ease",
              filter: isAlive ? "none" : "grayscale(0.2) brightness(0.95)",
            }}
          />
        );
      })}
    </div>
  );
}
