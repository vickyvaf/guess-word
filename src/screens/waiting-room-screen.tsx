import { useSettings } from "@/contexts/SettingsContext";
import type { Room } from "@/supabase/model";
import { services } from "@/supabase/service";
import { Button } from "@/uikits/button";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, SearchX, User } from "lucide-react";
import { useEffect, useState } from "react";

export function WaitingRoomScreen() {
  const navigate = useNavigate();
  const { user } = useSettings();
  const roomCode = window.location.pathname.split("/").pop(); // Get code from URL
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!roomCode) return;

    const fetchRoomData = async () => {
      setIsLoading(true);
      const { room } = await services.rooms.getByNameOrCode(roomCode);
      setRoom(room);
      setIsLoading(false);
    };

    fetchRoomData();
  }, [roomCode]);

  const handleStartGame = async () => {
    if (!room) return;

    // Update status to Playing
    await services.rooms.updateRoom(room.id, { status: "Playing" });

    // Navigate using the ROOM CODE as per request/current pattern
    navigate({ to: `/playing/${room.room_code}` });
  };

  let displayedUsers: any[] = [];

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!room) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            color: "var(--modal-text)",
          }}
        >
          <SearchX size={64} className="opacity-50" />
          <h1 style={{ margin: 0, fontSize: "2rem" }}>Room not found</h1>
          <p className="opacity-70">
            The code you entered might be incorrect or the room has expired.
          </p>
        </div>
        <Button fontSize="1.5rem" onClick={() => navigate({ to: "/" })}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        height: "100vh",
        padding: "0",
        position: "relative",
      }}
    >
      <div
        style={{
          textAlign: "center",
          flexShrink: 0,
          paddingTop: "6rem",
          paddingBottom: "1rem",
          width: "100%",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          Room: {room.name || room.room_code}
        </h1>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              background: "rgba(0,0,0,0.1)",
              padding: "0.2rem 0.5rem",
              borderRadius: "0.25rem",
            }}
          >
            Code: {room.room_code}
          </span>
        </div>
        <TextWaiting />
      </div>

      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "1rem",
          padding: "1rem",
          flex: 1,
          overflowY: "auto",
          alignContent: "start",
        }}
      >
        {displayedUsers.map((u) => (
          <div
            key={u.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem",
              background: "var(--input-bg)",
              border: "3px solid var(--button-border)",
              color: "var(--input-text)",
              borderRadius: "1rem",
              boxShadow: "4px 4px 0 var(--button-shadow)",
              aspectRatio: "1/1",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "var(--button-disabled-bg)", // Use variable
                display: "grid",
                placeItems: "center",
                overflow: "hidden",
              }}
            >
              {u.avatar_url ? (
                <img
                  src={u.avatar_url!}
                  alt={u.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User size={32} />
              )}
            </div>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                textAlign: "center",
                textWrap: "balance",
              }}
            >
              {u.name}
            </span>
            {u.isHost && (
              <span
                style={{
                  fontSize: "0.8rem",
                  background: "#FFD700",
                  color: "#000", // Ensure valid contrast on gold
                  padding: "0.2rem 0.6rem",
                  borderRadius: "1rem",
                  border: "2px solid var(--button-border)",
                  fontWeight: "bold",
                }}
              >
                HOST
              </span>
            )}
          </div>
        ))}

        {/* Empty slots placeholders */}
        {[
          ...Array(
            Math.max(0, (room.max_players || 4) - displayedUsers.length)
          ),
        ].map((_, i) => (
          <div
            key={`empty-${i}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem",
              background: "var(--empty-slot-bg)",
              border: "3px dashed var(--button-disabled-border)",
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
                background: "var(--button-disabled-bg)",
                display: "grid",
                placeItems: "center",
                opacity: 0.5,
              }}
            >
              <User size={32} color="var(--button-disabled-text)" />
            </div>
            <span
              style={{
                color: "var(--button-disabled-text)",
                fontWeight: "bold",
              }}
            >
              Empty
            </span>
          </div>
        ))}
      </div>

      {/* Only Host can start the game (or if debugging without host check) */}

      {(!room.host_id || room.host_id === user?.id) && (
        <div
          style={{
            width: "100%",
            padding: "1rem",
            background: "transparent",
            display: "flex",
            justifyContent: "center",
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <Button
            onClick={handleStartGame}
            fontSize="1.5rem"
            style={{ padding: "1rem 3rem", width: "100%", maxWidth: "400px" }}
          >
            Start Game
          </Button>
        </div>
      )}
    </div>
  );
}

function TextWaiting() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <p style={{ fontSize: "1.2rem", color: "#666", minWidth: "240px" }}>
      Waiting for players to join{dots}
    </p>
  );
}
