import { Button } from "@/uikits/button";
import { User } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

// Mock data for now, in a real app this would come from the server/room state
const MOCK_USERS = [
  {
    id: 1,
    name: "You",
    avatar: null,
    isHost: true,
    profile_url: null,
  },
  {
    id: 2,
    name: "Alice",
    avatar: null,
    isHost: false,
    profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  },
  {
    id: 3,
    name: "Bob",
    avatar: null,
    isHost: false,
    profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
  },
];

export function WaitingRoomScreen() {
  const navigate = useNavigate();
  const { user } = useSettings();
  const roomId = window.location.pathname.split("/").pop();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Merge real user data with mock data key 1 ("You")
  const users = MOCK_USERS.map((u) => {
    if (u.id === 1 && user) {
      return {
        ...u,
        profile_url: user.user_metadata?.avatar_url || null,
      };
    }
    return u;
  });

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "1rem",
        gap: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          Room #{roomId}
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#666", minWidth: "240px" }}>
          Waiting for players to join{dots}
        </p>
      </div>

      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1.5rem",
          padding: "1rem",
        }}
      >
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem",
              background: "white",
              border: "3px solid black",
              borderRadius: "1rem",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
              aspectRatio: "1/1",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#eee",
                display: "grid",
                placeItems: "center",
                border: "2px solid black",
                overflow: "hidden",
              }}
            >
              {user.profile_url ? (
                <img
                  src={user.profile_url}
                  alt={user.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User size={32} />
              )}
            </div>
            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              {user.name}
            </span>
            {user.isHost && (
              <span
                style={{
                  fontSize: "0.8rem",
                  background: "#FFD700",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "1rem",
                  border: "2px solid black",
                  fontWeight: "bold",
                }}
              >
                HOST
              </span>
            )}
          </div>
        ))}

        {/* Empty slots placeholders */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`empty-${i}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem",
              background: "rgba(255,255,255,0.5)",
              border: "3px dashed #ccc",
              borderRadius: "1rem",
              aspectRatio: "1/1",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.05)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <User size={32} color="#ccc" />
            </div>
            <span style={{ color: "#999", fontWeight: "bold" }}>Empty</span>
          </div>
        ))}
      </div>

      <Button
        onClick={() => navigate({ to: `/playing/${roomId}` })}
        fontSize="1.5rem"
        style={{ marginTop: "2rem", padding: "1rem 3rem" }}
      >
        Start Game
      </Button>
    </div>
  );
}
