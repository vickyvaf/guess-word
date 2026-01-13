import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/uikits/button";
import { HealthPoint } from "@/components/health-point";
import { useSettings } from "@/contexts/SettingsContext";
import { services } from "@/supabase/service";
import type { Room, RoomParticipant, User } from "@/supabase/model";
import { supabase } from "@/supabase/supabase";
import { Loader2, Crown } from "lucide-react";
import data from "@/data.json";

const MAX_HEALTH = 5;

export const Route = createFileRoute("/playing/$roomId")({
  component: PlayingPage,
});

function PlayingPage() {
  const { roomId } = Route.useParams();
  const navigate = useNavigate();
  const { user, volume } = useSettings();

  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<
    (RoomParticipant & { user: User })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Game State
  const [guessed, setGuessed] = useState<string[]>([]);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [countdown, setCountdown] = useState(3);

  // Fetch Room & Participants
  useEffect(() => {
    if (!roomId) return;

    const init = async () => {
      // 1. Get Room
      const { room: roomData } = await services.rooms.getByNameOrCode(roomId);
      if (!roomData) {
        navigate({ to: "/" });
        return;
      }
      setRoom(roomData);
      setCountdown(3);

      // 2. Get initial participants
      const { participants: parts } = await services.rooms.getParticipants(
        roomData.id
      );
      if (parts) setParticipants(parts);

      setIsLoading(false);

      // 3. Subscribe to Updates
      const channel = supabase
        .channel(`playing_${roomData.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "rooms",
            filter: `id=eq.${roomData.id}`,
          },
          (payload) => {
            const newRoom = payload.new as Room;
            setRoom(newRoom);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "room_participants",
            filter: `room_id=eq.${roomData.id}`,
          },
          () => {
            // Refresh participants on any change (score update, join/leave)
            services.rooms
              .getParticipants(roomData.id)
              .then(({ participants: parts }) => {
                if (parts) setParticipants(parts);
              });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, [roomId, navigate]);

  // Game Logic Effect (Host only initially, or finding word)
  useEffect(() => {
    if (!room || !user) return;

    // If host and no word is set, set one?
    // For now, let's assume we just want to play a local game SYNCED via DB?
    // Or actually, simpler: Host sets the word.

    if (room.host_id === user.id && !room.current_word) {
      // Pick random word
      const questions = Object.values(data).flat();
      const randomQ = questions[Math.floor(Math.random() * questions.length)];

      services.rooms.updateRoom(room.id, {
        current_word: randomQ.answer,
        // We could also store clue in DB if we added a column,
        // but for now let's just stick to "answer" and look up clue locally or if clue is not needed?
        // WAIT. We need the CLUE.
        // Let's assume we just store the generic "current_word" which includes data.
        // Actually, better to just store index or just the word string.
        // To keep it simple: We need to match the word to get the clue.
      });
    }
  }, [room, user]);

  // Derived State
  const currentQuestion = useMemo(() => {
    if (!room?.current_word) return null;
    // Find question data based on answer match
    const questions = Object.values(data).flat();
    return questions.find((q) => q.answer === room.current_word);
  }, [room?.current_word]);

  // Countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const answerChars = useMemo(
    () => (currentQuestion?.answer ?? "").toUpperCase().split(""),
    [currentQuestion]
  );

  const isSolved = useMemo(() => {
    const alphaChars = answerChars.filter((ch) => /[A-Z]/.test(ch));
    if (alphaChars.length === 0) return false;
    return alphaChars.every((ch) => guessed.includes(ch));
  }, [answerChars, guessed]);

  // Update Score when Solved
  useEffect(() => {
    if (isSolved && user && room) {
      // Increment score
      const currentScore =
        participants.find((p) => p.user_id === user.id)?.score || 0;
      services.rooms.updateScore(room.id, user.id, currentScore + 10);
    }
  }, [isSolved]);

  // Handle Guess
  const handleGuess = (letter: string) => {
    const L = letter.toUpperCase();
    if (guessed.includes(L) || health <= 0) return;
    if (isSolved) return;

    setGuessed((g) => [...g, L]);

    const isCorrect = answerChars.includes(L);
    if (!isCorrect) {
      setHealth((h) => Math.max(0, h - 1));
    } else {
      // Play success sound if needed
    }

    // Sound FX
    try {
      const a = new Audio("/casual-click-pop-ui.mp3");
      a.volume = (volume / 100) * 0.6;
      a.play();
    } catch {}
  };

  // Keyboard Listener
  useEffect(() => {
    if (countdown > 0) return;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) handleGuess(key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [countdown, guessed, health, answerChars]);

  if (isLoading || !room) {
    return (
      <div className="grid place-items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Waiting for Host to pick word (if null)
  if (!currentQuestion) {
    return (
      <div className="grid place-items-center h-screen text-2xl font-bold">
        Waiting for host to pick a word...
      </div>
    );
  }

  if (countdown > 0) {
    return (
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "3rem" }}>Get ready...</h1>
        <h1 style={{ margin: 0, fontSize: "8rem" }}>{countdown}</h1>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "6rem",
          padding: "2rem 1rem",
          position: "relative",
        }}
      >
        <HealthPoint health={health} />

        <div>
          <div
            style={{
              fontWeight: "bold",
              userSelect: "none",
              textAlign: "center",
              fontSize: "3rem",
              maxWidth: "90vw",
              marginBottom: "2rem",
            }}
          >
            {currentQuestion.clue}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            {answerChars.map((letter, index) => {
              const isAlpha = /[A-Z]/.test(letter);
              const show = !isAlpha || guessed.includes(letter);
              return (
                <span
                  key={`${letter}-${index}`}
                  style={{
                    display: "inline-block",
                    width: "3rem",
                    height: "60px",
                    lineHeight: "3rem",
                    borderBottom: isAlpha
                      ? "3px solid var(--input-border-focus)"
                      : "0",
                    margin: "0 0.2rem",
                    textAlign: "center",
                    fontSize: "4rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                  }}
                >
                  {show ? letter : ""}
                </span>
              );
            })}
          </div>
        </div>

        <div
          aria-label="Keyboard"
          style={{ display: "grid", gap: "0.6rem", userSelect: "none" }}
        >
          {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row) => (
            <div
              key={row}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {row.split("").map((key) => {
                const used = guessed.includes(key);
                const disabled = used || health <= 0 || isSolved;
                return (
                  <Button
                    key={key}
                    onClick={() => handleGuess(key)}
                    disabled={disabled}
                    style={{
                      border: "3px solid var(--button-border)",
                      borderRadius: "0.6rem",
                      backgroundColor: used
                        ? "var(--button-disabled-bg)"
                        : "var(--button-bg)",
                      color: used
                        ? "var(--button-disabled-text)"
                        : "var(--button-text)",
                      boxShadow: used
                        ? "none"
                        : "4px 4px 0 var(--button-shadow)",
                      fontSize: "2rem",
                      padding: "1rem 2rem",
                      fontWeight: 800,
                      cursor: disabled ? "not-allowed" : "pointer",
                      transition: "transform 0.08s ease",
                    }}
                  >
                    {key}
                  </Button>
                );
              })}
            </div>
          ))}
        </div>

        {health <= 0 && (
          <div className="fixed inset-0 bg-black/50 grid place-items-center z-50">
            <div className="bg-white p-8 rounded-xl text-center border-4 border-black">
              <h2 className="text-4xl font-black mb-4">Game Over</h2>
              <p className="text-xl">
                The word was:{" "}
                <span className="font-bold">{currentQuestion.answer}</span>
              </p>
              <Button onClick={() => navigate({ to: "/" })} className="mt-4">
                Back to Menu
              </Button>
            </div>
          </div>
        )}

        {isSolved && (
          <div className="fixed inset-0 bg-black/50 grid place-items-center z-50">
            <div className="bg-white p-8 rounded-xl text-center border-4 border-black">
              <h2 className="text-4xl font-black mb-4">Correct!</h2>
              <p className="text-xl">Waiting for next round...</p>
              {/** Logic for next round would go here, driven by Host updating DB **/}
            </div>
          </div>
        )}

        {/* Player List (Bottom Left) */}
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            left: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            zIndex: 40,
            pointerEvents: "none", // allow clicking through if needed, though buttons are usually higher
          }}
        >
          {participants
            .sort((a, b) => b.score - a.score)
            .map((p) => (
              <div
                key={p.user_id}
                style={{
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "2px solid var(--button-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "2px 2px 0 var(--button-shadow)",
                  minWidth: "160px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--button-disabled-bg)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {p.user.avatar_url && (
                    <img
                      src={p.user.avatar_url}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    lineHeight: 1,
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {p.user.name}
                    {room?.host_id === p.user_id && (
                      <Crown size={12} fill="#FFD700" color="#000" />
                    )}
                  </span>
                  <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                    {p.score} pts
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
