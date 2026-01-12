import { useState } from "react";
import { Input } from "@/uikits/input";
import { Button } from "@/uikits/button";
import { Switch } from "@/uikits/switch";
import { Modal } from "@/uikits/modal";
import { Dices, User, Lock } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const RANDOM_ADJECTIVES = [
  "Happy",
  "Lucky",
  "Sunny",
  "Bouncy",
  "Speedy",
  "Clever",
  "Shiny",
  "Brave",
  "Calm",
  "Wild",
];

const RANDOM_NOUNS = [
  "Panda",
  "Tiger",
  "Eagle",
  "Dolphin",
  "Fox",
  "Wizard",
  "Ninja",
  "Robot",
  "Star",
  "Comet",
];

const generateRandomName = () => {
  const adj =
    RANDOM_ADJECTIVES[Math.floor(Math.random() * RANDOM_ADJECTIVES.length)];
  const noun = RANDOM_NOUNS[Math.floor(Math.random() * RANDOM_NOUNS.length)];
  return `${adj} ${noun}`;
};

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
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [isPrivate, setIsPrivate] = useState(false);
  const [rooms, setRooms] = useState(MOCK_ROOMS);

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;

    // Simulate room creation
    const newRoom = {
      id: Date.now(),
      name: newRoomName,
      code: Math.floor(1000 + Math.random() * 9000).toString(),
      participants: 1,
      maxParticipants: maxParticipants,
      status: "Waiting",
      isPrivate: isPrivate,
    };

    setRooms([...rooms, newRoom]);
    setNewRoomName("");
    setMaxParticipants(4);
    setIsPrivate(false);
    setIsModalOpen(false);

    // Navigate to waiting room
    navigate({ to: `/waiting/${newRoom.code}` });
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

              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
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
                  <Lock size={12} /> {room.code}
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
                  {[...Array(room.maxParticipants)].map((_, i) => (
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
                  {room.participants}/{room.maxParticipants}
                </span>
              </div>
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
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <Input
                placeholder="Enter room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                autoFocus
                style={{ width: "100%" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateRoom();
                }}
              />
              <Button
                onClick={() => setNewRoomName(generateRandomName())}
                style={{
                  padding: "0.5rem 0.75rem",
                  width: "fit-content",
                  height: "fit-content",
                  fontSize: "2rem",
                }}
                title="Generate Random Name"
              >
                <Dices size={24} />
              </Button>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "1.2rem",
              }}
            >
              Max Players
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--input-bg)",
                  border: "4px solid var(--input-border)",
                  borderRadius: "0.5rem",
                  padding: "0.25rem",
                  boxShadow: "4px 4px 0 var(--input-shadow)",
                }}
              >
                <Button
                  onClick={() =>
                    setMaxParticipants(Math.max(2, maxParticipants - 1))
                  }
                  disabled={maxParticipants <= 2}
                  style={{
                    padding: "0.5rem",
                    fontSize: "1rem",
                    minWidth: "3rem",
                  }}
                >
                  -
                </Button>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    width: "2rem",
                    textAlign: "center",
                  }}
                >
                  {maxParticipants}
                </span>
                <Button
                  onClick={() =>
                    setMaxParticipants(Math.min(8, maxParticipants + 1))
                  }
                  disabled={maxParticipants >= 8}
                  style={{
                    padding: "0.5rem",
                    fontSize: "1rem",
                    minWidth: "3rem",
                  }}
                >
                  +
                </Button>
              </div>

              <div style={{ display: "flex", gap: "2px", opacity: 0.8 }}>
                {[...Array(maxParticipants)].map((_, i) => (
                  <User key={i} size={24} fill="currentColor" />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "1.2rem",
              }}
            >
              Privacy
            </label>
            <Switch
              label={
                isPrivate
                  ? "Private Room (Requires Code)"
                  : "Public Room (Open to All)"
              }
              checked={isPrivate}
              onChange={setIsPrivate}
              style={{ width: "100%" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <Button
              onClick={() => setIsModalOpen(false)}
              fontSize="1.2rem"
              style={{ background: "#eee" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRoom}
              fontSize="1.2rem"
              disabled={!newRoomName.trim()}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
