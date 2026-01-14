import {
  ModalCreateRoom,
  ModalEnterPasscode,
} from "@/components/modal-create-room";
import { useDebounce } from "@/hooks/use-debounce";
import type { Room } from "@/supabase/model";
import { services } from "@/supabase/service";
import { supabase } from "@/supabase/supabase";
import { Button } from "@/uikits/button";
import { Input } from "@/uikits/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Ghost, Globe, Lock, User } from "lucide-react";
import { useEffect, useState } from "react";

export function ChooseRoomScreen() {
  const [searchRoomName, setSearchRoomName] = useState("");
  const [debouncedSearchRoomName] = useDebounce(searchRoomName, 500);

  const queryClient = useQueryClient();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["rooms", { search: debouncedSearchRoomName }],
    queryFn: async () => {
      const { rooms } = await services.rooms.getAllRooms();
      return rooms || [];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("realtime:rooms")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            queryClient.setQueryData<Room[]>(
              ["rooms", { search: searchRoomName }],
              (oldData) => [payload.new as Room, ...(oldData || [])]
            );
          }
          if (payload.eventType === "DELETE") {
            queryClient.setQueryData<Room[]>(
              ["rooms", { search: searchRoomName }],
              // @ts-ignore
              (oldData) => oldData?.filter((room) => room.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        height: "100vh",
        overflow: "hidden",
        padding: "1rem",
        paddingTop: "6rem",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .responsive-header {
            flex-direction: column;
            margin-top: 1rem;
          }
          .responsive-btn {
            width: 100% !important;
          }
          .responsive-max-players-container {
            flex-wrap: wrap;
          }
          .responsive-max-players-controls {
            width: 100%;
            justify-content: space-between;
          }
        }
        @media (min-width: 768px) {
          .responsive-header {
            flex-direction: row;
            margin-top: 0;
          }
          .responsive-btn {
            width: auto !important;
          }
          .responsive-max-players-container {
            flex-wrap: nowrap;
          }
          .responsive-max-players-controls {
            width: auto;
            justify-content: center;
          }
        }
      `}</style>
      <div
        className="responsive-header"
        style={{
          width: "100%",
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        <Input
          placeholder="Enter room name"
          value={searchRoomName}
          onChange={(e) => setSearchRoomName(e.target.value)}
          style={{
            width: "100%",
          }}
        />
        <ModalCreateRoom />
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          paddingBottom: "1rem",
        }}
      >
        {isLoading && <SkeletonListRoom />}
        {!isLoading && !rooms?.length && <Empty />}
        {!isLoading && rooms && rooms?.length > 0
          ? rooms?.map((room) => <CardRoom key={room.id} room={room} />)
          : null}
      </div>
    </div>
  );
}

function SkeletonListRoom() {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "4px solid var(--button-border, #000)",
            backgroundColor: "var(--input-bg)",
            boxShadow: "4px 4px 0 var(--button-shadow, #000)",
            opacity: 0.7,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              width: "100%",
            }}
          >
            <div
              className="shimmer"
              style={{
                height: "1.5rem",
                width: "50%",
                borderRadius: "0.25rem",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <div
                className="shimmer"
                style={{
                  height: "1rem",
                  width: "30%",
                  borderRadius: "0.25rem",
                }}
              />
              <div
                className="shimmer"
                style={{
                  height: "1rem",
                  width: "20%",
                  borderRadius: "0.25rem",
                }}
              />
            </div>
            <div
              className="shimmer"
              style={{
                marginTop: "0.5rem",
                height: "1rem",
                width: "40%",
                borderRadius: "0.25rem",
              }}
            />
          </div>
          <div
            className="shimmer"
            style={{
              height: "2.5rem",
              width: "5rem",
              borderRadius: "0.5rem",
              marginLeft: "1rem",
            }}
          />
        </div>
      ))}
    </>
  );
}

function CardRoom({ room }: { room: Room }) {
  return (
    <>
      <ModalEnterPasscode room={room} />
      <div
        key={room.id}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
          borderRadius: "0.5rem",
          border: "4px solid var(--button-border, #000)",
          backgroundColor: "var(--input-bg)",
          boxShadow: "4px 4px 0 var(--button-shadow, #000)",
          transition: "transform 0.1s ease",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {room.name}
          </span>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                color: "var(--button-text)",
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: "0.1rem 0.5rem",
                borderRadius: "0.3rem",
                fontFamily: "monospace",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              {room.is_private ? (
                <>
                  <Lock size={12} /> Private
                </>
              ) : (
                <>
                  <Globe size={12} /> Public
                </>
              )}
            </span>
            <span
              style={{
                color:
                  room.status === "Playing" ? "#fff" : "var(--button-text)",
                backgroundColor:
                  room.status === "Playing" ? "#ff9800" : "#4caf50",
                fontWeight: "bold",
                fontSize: "0.8rem",
                padding: "0.1rem 0.5rem",
                borderRadius: "1rem",
                display: "flex",
                alignItems: "center",
                textTransform: "uppercase",
              }}
            >
              {room.status}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              marginTop: "0.5rem",
              color: "#666",
            }}
          >
            <div style={{ display: "flex", gap: "2px" }}>
              {[...Array(room.max_players)].map((_, i) => (
                <User
                  key={i}
                  size={20}
                  fill={i < room.participants ? "currentColor" : "none"}
                  style={{
                    color:
                      i < room.participants
                        ? "var(--modal-text)"
                        : "var(--input-border)",
                    opacity: i < room.participants ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: "0.9rem", marginLeft: "0.5rem" }}>
              {room.participants}/{room.max_players}
            </span>
          </div>
        </div>

        <Button
          fontSize="1rem"
          disabled={
            room.status === "Playing" || room.participants >= room.max_players
          }
          style={{ padding: "0.5rem 1rem" }}
        >
          {room.status === "Playing" ? "Spectate" : "Join"}
        </Button>
      </div>
    </>
  );
}

function Empty() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "#999",
        gap: "1rem",
      }}
    >
      <Ghost size={64} opacity={0.5} />
      <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        No rooms found
      </span>
      <span style={{ fontSize: "0.9rem" }}>
        Create a new one to get started!
      </span>
    </div>
  );
}
