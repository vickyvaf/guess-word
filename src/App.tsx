import { useEffect, useRef, useState } from "react";
import { MathGridBg } from "./components/background";
import { ChooseCategory } from "./components/choose-category";
import { Button } from "./uikits/button";
import { Modal } from "./uikits/modal";
import { PlayingField } from "./components/playing";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(100);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [showContent, setShowContent] = useState("welcome");
  const [categorySelected, setCategorySelected] = useState("");

  useEffect(() => {
    audioRef.current = new Audio("/casual-click-pop-ui.mp3");
    audioRef.current.volume = 1;
  }, []);

  // apply volume saat slider berubah
  useEffect(() => {
    if (audioRef.current)
      audioRef.current.volume = Math.max(0, Math.min(100, volume)) / 100;
  }, [volume]);

  const playSound = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          position: "absolute",
          display: showContent === "welcome" ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "2rem",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "1.5rem",
            maxWidth: "900px",
            lineHeight: 1.4,
            userSelect: "none",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
            }}
          >
            Welcome to the ultimate word guessing challenge!
          </span>
          <br />
          <br />
          <span>
            Try to uncover the hidden word by guessing letters before you run
            out of attempts.
          </span>
          <br />
          <span> Sharpen your vocabulary and have fun along the way!</span>
        </p>
        <Button
          onClick={() => {
            setShowContent("choose-category");
          }}
        >
          Play
        </Button>
      </div>
      {showContent === "choose-category" ? (
        <ChooseCategory
          onClick={setShowContent}
          setCategorySelected={setCategorySelected}
        />
      ) : null}
      {showContent === "playing" ? (
        <PlayingField
          categorySelected={categorySelected}
          setShowContent={setShowContent}
        />
      ) : null}
      <img
        src="/champion.png"
        className="logo"
        alt="Logo"
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          cursor: "pointer",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        width={100}
        height={100}
        onClick={playSound}
      />
      <img
        src="/gear.png"
        className="logo"
        alt="Logo"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          borderRadius: "100%",
          border: "2px solid black",
          padding: "0.5rem",
          backgroundColor: "white",
          boxShadow: "3px 3px 6px rgba(0,0,0,0.2)",
          transition: "transform 0.1s ease",
          cursor: "pointer",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        width={50}
        height={50}
        onClick={() => {
          setIsOpen(true);
          playSound();
        }}
      />
      <MathGridBg cell={30} major={30} />
      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Settings">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "2px solid black",
              display: "grid",
              placeItems: "center",
              background: "#f3f4f6",
              fontWeight: 700,
            }}
            title="Not connected"
          >
            {"?"}
          </div>

          <div
            style={{ display: "grid", lineHeight: 1.2, textAlign: "center" }}
          >
            <span style={{ fontWeight: 700 }}>{"Not connected"}</span>
            <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>
              {"Connect your Google account"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {true ? (
              <button
                // onClick={connectGoogle}
                style={{
                  cursor: "pointer",
                  border: "2px solid black",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  background: "white",
                  boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.97)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {/* Google "G" mini (inline SVG) */}
                <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.8 31.9 29.3 35 24 35 16.8 35 11 29.2 11 22s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.6 3.4 29.6 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22 22-9.8 22-22c0-1.5-.2-3-.4-4.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 16 18.9 13 24 13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.6 7.4 29.6 5 24 5c-7.4 0-13.7 4.2-17 10.4z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 41c5.2 0 9.8-1.7 13.1-4.7l-6.1-5c-2 1.4-4.7 2.2-7 2.2-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.4 36.6 16.1 41 24 41z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.3-3.8 5.9-7.3 6.9l6.1 5c3.6-3.3 5.9-8.1 5.9-13.9 0-1.5-.2-3-.4-4.5z"
                  />
                </svg>
                Connect Google
              </button>
            ) : (
              <button
                // onClick={signOut}
                style={{
                  cursor: "pointer",
                  border: "2px solid black",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  background: "#fee2e2",
                  boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                  fontWeight: 600,
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.97)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Sign out
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Volume: {volume}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              style={{
                width: "100%",
                height: "8px",
                borderRadius: "6px",
                background: `linear-gradient(to right, #3b82f6 ${volume}%, #e5e7eb ${volume}%)`,
                outline: "none",
                cursor: "grab",
                accentColor: "#3b82f6", // warna thumb modern browser
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.cursor = "grabbing";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.cursor = "grab";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.cursor = "grab";
              }}
            />
          </label>
        </div>
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Background Music: {volume}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}

export default App;
