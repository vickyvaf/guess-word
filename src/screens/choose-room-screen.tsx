import { useState } from "react";
import { Input } from "@/uikits/input";
import { Button } from "@/uikits/button";
import { Modal } from "@/uikits/modal";
import { useNavigate } from "@tanstack/react-router";

const MOCK_ROOMS = [
  {
    id: 1,
    name: "Fun Room",
    code: "1234",
    participants: 2,
    maxParticipants: 4,
    status: "Waiting",
  },
  {
    id: 2,
    name: "Word Wizards",
    code: "5678",
    participants: 1,
    maxParticipants: 4,
    status: "Waiting",
  },
  {
    id: 3,
    name: "Guess Master",
    code: "9012",
    participants: 3,
    maxParticipants: 4,
    status: "Playing",
  },
];

export function ChooseRoomScreen() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [rooms, setRooms] = useState(MOCK_ROOMS);

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;

    // Simulate room creation
    const newRoom = {
      id: Date.now(),
      name: newRoomName,
      code: Math.floor(1000 + Math.random() * 9000).toString(),
      participants: 1,
      maxParticipants: 4,
      status: "Waiting",
    };

    setRooms([...rooms, newRoom]);
    setNewRoomName("");
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        <Input
          placeholder="Enter room name or room code"
          style={{
            width: "100%",
          }}
          autoFocus
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          fontSize="1.5rem"
          style={{ whiteSpace: "nowrap" }}
        >
          + Add
        </Button>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {rooms.map((room) => (
          <div
            key={room.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              borderRadius: "0.5rem",
              border: "4px solid var(--button-border, #000)",
              backgroundColor: "var(--card-bg, #fff)",
              boxShadow: "4px 4px 0 var(--button-shadow, #000)",
              transition: "transform 0.1s ease",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {room.name}
              </span>
              <span
                style={{ fontSize: "1rem", color: "#666", marginTop: "0.2rem" }}
              >
                Code:{" "}
                <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                  {room.code}
                </span>
              </span>
              <span style={{ fontSize: "1rem", color: "#666" }}>
                {room.participants}/{room.maxParticipants} •{" "}
                <span
                  style={{
                    color: room.status === "Playing" ? "orange" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {room.status}
                </span>
              </span>
            </div>

            <Button
              fontSize="1rem"
              disabled={
                room.status === "Playing" ||
                room.participants >= room.maxParticipants
              }
              onClick={() => console.log(`Joined ${room.id}`)}
              style={{ padding: "0.5rem 1rem" }}
            >
              {room.status === "Playing" ? "Spectate" : "Join"}
            </Button>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Room"
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "1.2rem",
              }}
            >
              Room Name
            </label>
            <Input
              placeholder="e.g. Vicky's Room"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              autoFocus
              style={{ width: "100%" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateRoom();
              }}
            />
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <Button
              onClick={() => setIsModalOpen(false)}
              fontSize="1.2rem"
              style={{ background: "#eee" }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateRoom} fontSize="1.2rem">
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
