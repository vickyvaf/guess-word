import { useSettings } from "@/contexts/SettingsContext";
import type { Room } from "@/supabase/model";
import { services } from "@/supabase/service";
import { Button } from "@/uikits/button";
import { Input } from "@/uikits/input";
import { Modal } from "@/uikits/modal";
import { Switch } from "@/uikits/switch";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Dices, Plus, User } from "lucide-react";
import { useState } from "react";

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

function generateRandomName() {
  const adj =
    RANDOM_ADJECTIVES[Math.floor(Math.random() * RANDOM_ADJECTIVES.length)];
  const noun = RANDOM_NOUNS[Math.floor(Math.random() * RANDOM_NOUNS.length)];
  return `${adj} ${noun}`;
}

export function ModalCreateRoom() {
  const navigate = useNavigate();

  const { user } = useSettings();

  const [isOpen, setIsOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [isPrivate, setIsPrivate] = useState(false);

  function handleOpenModal() {
    setIsOpen(true);
  }

  function handleCloseModal() {
    setNewRoomName("");
    setMaxParticipants(4);
    setIsPrivate(false);
    setIsOpen(false);
  }

  const { mutate: createRoom, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      if (!user) {
        alert("Please sign in to create a room");
        throw new Error("Not authenticated");
      }

      const { room, error } = await services.rooms.createRoom({
        name: newRoomName,
        room_code: Math.floor(1000 + Math.random() * 9000).toString(),
        participants: 1,
        max_players: maxParticipants,
        status: "Waiting",
        is_private: isPrivate,
        created_by: user.id,
        host_id: user.id,
      });

      if (error || !room) {
        throw new Error(error?.message || "Failed to create room");
      }

      if (user?.id) {
        await services.rooms.updateRoom(room.id, { participants: 1 });
      }

      return room;
    },
    onSuccess: (room) => {
      handleCloseModal();
      navigate({ to: `/waiting/${room.room_code}` });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  return (
    <>
      <Button
        fontSize="1.5rem"
        className="responsive-btn"
        style={{
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center",
        }}
        onClick={handleOpenModal}
      >
        <Plus /> Create Room
      </Button>

      <Modal open={isOpen} onClose={handleCloseModal} title="Create New Room">
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
                style={{ width: "100%" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createRoom();
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
            <div
              className="responsive-max-players-container"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                className="responsive-max-players-controls"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--input-bg)",
                  border: "4px solid var(--button-border)",
                  borderRadius: "0.5rem",
                  padding: "0.25rem",
                  boxShadow: "4px 4px 0 var(--input)",
                }}
              >
                <Button
                  onClick={() =>
                    setMaxParticipants(Math.max(1, maxParticipants - 1))
                  }
                  disabled={maxParticipants <= 1}
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
              justifyContent: "space-between",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <Button
              onClick={handleCloseModal}
              fontSize="1.2rem"
              style={{ background: "#eee", width: "100%", color: "#000" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => createRoom()}
              fontSize="1.2rem"
              disabled={!newRoomName.trim() || isCreating || !user}
              style={{ width: "100%" }}
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function ModalEnterPasscode({ room }: { room: Room }) {
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  return (
    <Modal
      open={isPasscodeModalOpen}
      onClose={() => setIsPasscodeModalOpen(false)}
      title={`Enter Passcode for ${room?.name}`}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "1.2rem",
            }}
          >
            Room Code
          </label>
          <Input
            placeholder="Enter room code"
            value={passcodeInput}
            onChange={(e) => {
              setPasscodeInput(e.target.value);
              if (passcodeError) setPasscodeError("");
            }}
            style={{ width: "100%" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
              }
            }}
          />
          {passcodeError && (
            <div
              style={{
                color: "red",
                fontSize: "0.9rem",
                marginTop: "0.5rem",
              }}
            >
              {passcodeError}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <Button
            onClick={() => setIsPasscodeModalOpen(false)}
            fontSize="1.2rem"
            style={{ background: "#eee", width: "100%", color: "#000" }}
          >
            Cancel
          </Button>
          <Button
            fontSize="1.2rem"
            disabled={!passcodeInput.trim()}
            style={{ width: "100%" }}
          >
            Join Room
          </Button>
        </div>
      </div>
    </Modal>
  );
}
