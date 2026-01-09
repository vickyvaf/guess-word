import { useState, useEffect, useRef } from "react";
import { Button } from "../uikits/button";
import { Modal } from "../uikits/modal";
import { Trophy } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  category: string;
  healthRemaining: number;
  date: string;
}

export function ModalLeaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const { volume } = useSettings();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("leaderboard");
    if (saved) {
      try {
        const entries = JSON.parse(saved) as LeaderboardEntry[];
        // Sort by score (descending), then by date (newest first)
        const sorted = entries.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setLeaderboard(sorted);
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      }
    }
  }, [isOpen]); // Reload when modal opens

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}.`;
  };

  const clearLeaderboard = () => {
    if (confirm("Are you sure you want to clear the leaderboard?")) {
      localStorage.removeItem("leaderboard");
      setLeaderboard([]);
    }
  };

  return (
    <>
      <img
        src="/champion.png"
        className="logo"
        alt="Leaderboard"
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
        onClick={() => {
          playSound();
          setIsOpen(true);
        }}
      />

      {isOpen ? (
        <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Leaderboard">
          {leaderboard.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                padding: "2rem 0",
                textAlign: "center",
              }}
            >
              <Trophy width={64} height={64} style={{ opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: "1.1rem", color: "#6b7280" }}>
                No scores yet. Play a game to see your scores here!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                style={{
                  display: "grid",
                  gap: "0.5rem",
                  maxHeight: "60vh",
                  overflowY: "auto",
                  paddingRight: "0.5rem",
                }}
              >
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div
                    key={entry.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.75rem",
                      border: "2px solid black",
                      borderRadius: "0.5rem",
                      background:
                        index === 0
                          ? "#fef3c7"
                          : index === 1
                          ? "#e5e7eb"
                          : index === 2
                          ? "#fed7aa"
                          : "white",
                      boxShadow: "2px 2px 0 rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        minWidth: "2.5rem",
                        textAlign: "center",
                      }}
                    >
                      {getRankIcon(index + 1)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {entry.playerName || "Anonymous"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#4b5563",
                          display: "flex",
                          gap: "0.75rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>
                          <strong>Score:</strong> {entry.score}/5
                        </span>
                        <span>
                          <strong>Category:</strong> {entry.category}
                        </span>
                        {entry.healthRemaining > 0 && (
                          <span>
                            <strong>Health:</strong> {entry.healthRemaining}/5
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          marginTop: "0.25rem",
                        }}
                      >
                        {formatDate(entry.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {leaderboard.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "0.5rem",
                  }}
                >
                  <Button
                    onClick={clearLeaderboard}
                    style={{
                      fontSize: "0.9rem",
                      padding: "0.5rem 1rem",
                      background: "#fee2e2",
                      border: "2px solid black",
                      borderRadius: "0.5rem",
                      boxShadow: "2px 2px 0 rgba(0,0,0,0.2)",
                    }}
                  >
                    Clear Leaderboard
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      ) : null}
    </>
  );
}

// Helper function to add a score to the leaderboard
export function addToLeaderboard(
  playerName: string,
  score: number,
  category: string,
  healthRemaining: number
) {
  const entry: LeaderboardEntry = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    playerName,
    score,
    category,
    healthRemaining,
    date: new Date().toISOString(),
  };

  const saved = localStorage.getItem("leaderboard");
  const entries: LeaderboardEntry[] = saved ? JSON.parse(saved) : [];
  entries.push(entry);

  // Keep only top 50 entries
  const sorted = entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  localStorage.setItem("leaderboard", JSON.stringify(sorted.slice(0, 50)));
}
