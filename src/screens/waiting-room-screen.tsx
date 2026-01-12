import { Button } from "@/uikits/button";
import { User, Loader2 } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { services } from "@/supabase/service";
import type { Room, User as UserType } from "@/supabase/model";

export function WaitingRoomScreen() {
  const navigate = useNavigate();
  const { user } = useSettings();
  const roomCode = window.location.pathname.split("/").pop(); // Get code from URL
  const [dots, setDots] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!roomCode) return;

    const fetchRoomData = async () => {
      setIsLoading(true);
      const { room } = await services.rooms.getByNameOrCode(roomCode);

      if (room) {
        setRoom(room);

        // Fetch initial participants
        const { participants } =
          await services.roomParticipants.getParticipants(room.id);
        if (participants) setParticipants(participants);
      }
      setIsLoading(false);
    };

    fetchRoomData();
  }, [roomCode]);

  // Realtime subscription
  useEffect(() => {
    if (!room) return;

    const subscription = services.roomParticipants.subscribe(
      room.id,
      async () => {
        // Refresh participants on any change
        const { participants } =
          await services.roomParticipants.getParticipants(room.id);
        if (participants) setParticipants(participants);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [room?.id]);

  const handleStartGame = async () => {
    if (!room) return;

    // Update status to Playing
    await services.rooms.updateRoom(room.id, { status: "Playing" });

    // Navigate using the ROOM CODE as per request/current pattern
    navigate({ to: `/playing/${room.room_code}` });
  };

  // Use participants state for display
  const displayedUsers = participants.map((p) => ({
    id: p.id,
    name: p.name || p.full_name || "Unknown",
    avatar_url: p.avatar_url || p.picture,
    isHost: room?.host_id === p.id,
  }));

  // Ensure current user is in the list (optimistic)?
  // Actually, if we subscribed correctly and joined correctly, they should be in the list.
  // But let's trust the DB list for Truth.

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
        }}
      >
        <h1>Room not found</h1>
        <Button onClick={() => navigate({ to: "/" })}>Go Home</Button>
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
        justifyContent: "center",
        height: "100vh",
        padding: "1rem",
        gap: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
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
        {displayedUsers.map((u) => (
          <div
            key={u.id}
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

      {/* Only Host can start the game (or if debugging without host check) */}
      {(!room.host_id || room.host_id === user?.id) && (
        <Button
          onClick={handleStartGame}
          fontSize="1.5rem"
          style={{ marginTop: "2rem", padding: "1rem 3rem" }}
        >
          Start Game
        </Button>
      )}
    </div>
  );
}
