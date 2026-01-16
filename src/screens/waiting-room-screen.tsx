import { useSettings } from "@/contexts/SettingsContext";
import type { Room } from "@/supabase/model";
import { services } from "@/supabase/service";
import { supabase } from "@/supabase/supabase";
import { Button } from "@/uikits/button";
import { useNavigate } from "@tanstack/react-router";
import { Crown, SearchX, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { User as UserType, RoomParticipant } from "@/supabase/model";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function WaitingRoomScreen() {
  const navigate = useNavigate();
  const { user } = useSettings();
  const roomCode = window.location.pathname.split("/").pop(); // Get code from URL
  const queryClient = useQueryClient();
  // 1. Get Room
  const { data: room, isLoading: isLoadingRoom } = useQuery({
    queryKey: ["room", roomCode],
    queryFn: async () => {
      if (!roomCode) return null;
      const { room, error } = await services.rooms.getByNameOrCode(roomCode);
      if (error) throw error;
      return room;
    },
    enabled: !!roomCode,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // 2. Join Room (Side Effect)
  useEffect(() => {
    if (room && user) {
      services.rooms.joinRoom(room.id, user.id).then(() => {
        // Invalidate participants to ensure we are in the list
        queryClient.invalidateQueries({ queryKey: ["participants", room.id] });
      });
    }
  }, [room, user, queryClient]);

  // 3. Get Participants
  const { data: participants = [], isLoading: isLoadingParticipants } =
    useQuery({
      queryKey: ["participants", room?.id],
      queryFn: async () => {
        if (!room?.id) return [];
        const { participants } = await services.rooms.getParticipants(room.id);
        return (
          (participants?.filter((p) => p.user) as (RoomParticipant & {
            user: UserType;
          })[]) || []
        );
      },
      enabled: !!room?.id,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const isLoading = isLoadingRoom || isLoadingParticipants;

  // 4. Realtime Subscription & Presence
  useEffect(() => {
    if (!room || !user) return;

    const channel = supabase
      .channel(`room_${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_participants",
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          // Invalidate participants query to refetch
          queryClient.invalidateQueries({
            queryKey: ["participants", room.id],
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          const newRoom = payload.new as Room;
          // Update room data in cache
          queryClient.setQueryData(["room", roomCode], newRoom);

          if (newRoom.status === "Playing") {
            navigate({ to: `/playing/${newRoom.room_code}` });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room, queryClient, navigate, roomCode]);

  const handleStartGame = async () => {
    if (!room) return;

    // Update status to Playing. Navigation happens via realtime subscription or fallback
    await services.rooms.startGame(room.id);
    navigate({ to: `/playing/${room.room_code}` });
  };

  if (isLoading) {
    return (
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          marginTop: "2rem",
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            paddingTop: "6rem",
            paddingBottom: "1rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            gap: "1rem",
          }}
        >
          {/* Room Name */}
          <Skeleton width="60%" height="3rem" />

          {/* Room Code Badge */}
          <Skeleton width="120px" height="2rem" />

          {/* Waiting Text */}
          <Skeleton width="240px" height="1.5rem" />
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
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem",
                background: "var(--input-bg)",
                border: "3px solid transparent",
                borderRadius: "1rem",
                aspectRatio: "1/1",
                justifyContent: "center",
              }}
            >
              <Skeleton width="64px" height="64px" borderRadius="50%" />
              <Skeleton width="80%" height="1.2rem" />
            </div>
          ))}
        </div>
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
          {room.is_private && (
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
          )}
        </div>
        <TextWaiting />
      </div>

      <div
        style={{
          maxWidth: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "1rem",
          padding: "1rem",
          flex: 1,
          overflowY: "auto",
          alignContent: "start",
          height: "100px",
        }}
      >
        {participants.map((p) => (
          <div
            key={p.user_id}
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
              maxHeight: "300px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "var(--button-disabled-bg)", // Use variable
                  display: "grid",
                  placeItems: "center",
                  overflow: "hidden",
                }}
              >
                {p.user.avatar_url ? (
                  <img
                    src={p.user.avatar_url!}
                    alt={p.user.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <User size={32} />
                )}
              </div>
              {room.host_id === p.user_id && (
                <div
                  style={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    background: "#FFD700",
                    borderRadius: "50%",
                    padding: "4px",
                    border: "2px solid var(--button-border)",
                    display: "grid",
                    placeItems: "center",
                    zIndex: 10,
                  }}
                >
                  <Crown size={14} color="#000" fill="#000" />
                </div>
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
              {p.user.name || "Unknown"}
            </span>
          </div>
        ))}

        {/* Empty slots placeholders */}
        {[
          ...Array(Math.max(0, (room.max_players || 4) - participants.length)),
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
              maxHeight: "300px",
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

      {/* Button Section */}
      <div
        style={{
          width: "100%",
          padding: "1rem",
          background: "transparent",
          display: "flex",
          justifyContent: "center",
          flexShrink: 0,
          zIndex: 10,
          gap: "1rem",
        }}
      >
        {(!room.host_id || room.host_id === user?.id) && (
          <Button
            onClick={handleStartGame}
            fontSize="1.5rem"
            disabled={participants.length < 2}
            style={{ padding: "1rem 3rem", width: "100%", maxWidth: "400px" }}
          >
            Start Game
          </Button>
        )}
      </div>
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

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

function Skeleton({
  width,
  height,
  borderRadius = "0.5rem",
  style,
  className = "",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`shimmer ${className}`}
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
        ...style,
      }}
      {...props}
    />
  );
}
