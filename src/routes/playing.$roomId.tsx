import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import data from "@/data.json";
import { Button } from "@/uikits/button";
import { HealthPoint } from "@/components/health-point";
import { useSettings } from "@/contexts/SettingsContext";

const MAX_HEALTH = 5;
const TOTAL = 5;

export const Route = createFileRoute("/playing/$roomId")({
  component: PlayingPage,
});

function PlayingPage() {
  const { roomId } = Route.useParams();
  const navigate = useNavigate();
  const { volume } = useSettings();
  const [completed, setCompleted] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [health, setHealth] = useState(MAX_HEALTH);
  const hasSavedScore = useRef(false);

  // @ts-ignore
  const questions = data?.[roomId] || Object.values(data).flat();

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestionIndex(Math.floor(Math.random() * questions.length));
      setGuessed([]);
      setHealth(MAX_HEALTH);
      setCountdown(3);
      setCompleted(0);
      hasSavedScore.current = false;
    }
  }, [roomId, questions.length]);

  const currentQuestion = questions[currentQuestionIndex];

  const answerChars: string[] = useMemo(
    () => (currentQuestion?.answer ?? "").toUpperCase().split(""),
    [currentQuestion]
  );

  const isSolved = useMemo(() => {
    const alphaChars = answerChars.filter((ch) => /[A-Z]/.test(ch));
    if (alphaChars.length === 0) return false;
    return alphaChars.every((ch) => guessed.includes(ch));
  }, [answerChars, guessed]);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleGuess = (letter: string) => {
    const L = letter.toUpperCase();
    if (guessed.includes(L) || health <= 0) return;
    if (isWin) return;

    setGuessed((g) => [...g, L]);

    const isCorrect = answerChars.includes(L);
    if (!isCorrect) setHealth((h) => Math.max(0, h - 1));

    try {
      const a = new Audio("/casual-click-pop-ui.mp3");
      a.volume = (volume / 100) * 0.6;
      a.play();
    } catch {}
  };

  useEffect(() => {
    if (countdown > 0) return;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) handleGuess(key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [countdown, guessed, health, answerChars]);

  const isWin = completed >= TOTAL;

  useEffect(() => {
    if (!isSolved || isWin) return;

    try {
      const s = new Audio("/success-quiz.mp3");
      s.volume = (volume / 100) * 0.7;
      s.play();
    } catch {}

    setCompleted((c) => {
      const nextC = Math.min(TOTAL, c + 1);
      if (nextC >= TOTAL) {
        return nextC;
      }

      const len = Math.max(1, questions.length);
      let next = Math.floor(Math.random() * len);
      if (len > 1 && next === currentQuestionIndex) next = (next + 1) % len;
      setCurrentQuestionIndex(next);
      setGuessed([]);
      return nextC;
    });
  }, [isSolved, questions.length]);

  const isGameOver = health <= 0;
  const backToMenu = () => navigate({ to: "/" });

  if (!currentQuestion) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: "100vw",
          height: "100vh",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        No question found.
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
        <h1 style={{ margin: 0, fontSize: "3rem" }}>
          Get ready, the game begins in
        </h1>
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
                    borderBottom: isAlpha ? "3px solid black" : "0",
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
                const disabled = used || isGameOver || isWin;
                return (
                  <Button
                    key={key}
                    onClick={() => handleGuess(key)}
                    disabled={disabled}
                    style={{
                      border: "3px solid black",
                      borderRadius: "0.6rem",
                      backgroundColor: used ? "#e5e7eb" : "white",
                      color: used ? "#6b7280" : "#111827",
                      boxShadow: used ? "none" : "4px 4px 0 rgba(0,0,0,0.2)",
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

        {isGameOver && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Game Over"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              display: "grid",
              placeItems: "center",
              zIndex: 50,
            }}
          >
            <div
              style={{
                width: "min(90vw, 560px)",
                background: "white",
                border: "3px solid black",
                borderRadius: "1rem",
                boxShadow: "8px 8px 0 rgba(0,0,0,0.25)",
                padding: "1.25rem 1.25rem 1rem",
                color: "#111827",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "2.5rem",
                  lineHeight: 1.2,
                  fontWeight: 900,
                }}
              >
                Game Over
              </h2>
              <img src="/dead.png" width={200} height={200} />
              <p
                style={{
                  margin: "0.75rem 0 0",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                The correct answer was:
              </p>
              <div
                style={{
                  marginTop: "0.25rem",
                  fontSize: "2rem",
                  fontWeight: 900,
                  letterSpacing: "1px",
                }}
              >
                {currentQuestion.answer?.toUpperCase?.() ?? ""}
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
              >
                <Button
                  onClick={backToMenu}
                  style={{
                    border: "3px solid black",
                    borderRadius: "0.75rem",
                    backgroundColor: "white",
                    boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
                    fontSize: "1.25rem",
                    padding: "0.75rem 1.25rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "transform 0.08s ease",
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {isWin && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Congratulations"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              display: "grid",
              placeItems: "center",
              zIndex: 60,
            }}
          >
            <div
              style={{
                width: "min(90vw, 600px)",
                background: "white",
                border: "3px solid black",
                borderRadius: "1rem",
                boxShadow: "8px 8px 0 rgba(0,0,0,0.25)",
                padding: "1.25rem 1.25rem 1.25rem",
                color: "#111827",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "2.5rem",
                  lineHeight: 1.2,
                  fontWeight: 900,
                  marginBottom: 40,
                }}
              >
                Congratulations!
              </h2>
              <img
                src="/trophy.png"
                style={{
                  margin: "1rem",
                }}
                width={200}
                height={200}
              />

              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
              >
                <Button
                  onClick={backToMenu}
                  style={{
                    border: "3px solid black",
                    borderRadius: "0.75rem",
                    backgroundColor: "white",
                    boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
                    fontSize: "1.1rem",
                    padding: "0.75rem 1.25rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "transform 0.08s ease",
                  }}
                >
                  Back to Menu
                </Button>
                <Button
                  onClick={() => {
                    setCompleted(0);
                    setGuessed([]);
                    setHealth(MAX_HEALTH);
                    const len = Math.max(1, questions.length);
                    setCurrentQuestionIndex(Math.floor(Math.random() * len));
                    setCountdown(3);
                    hasSavedScore.current = false;
                  }}
                  style={{
                    border: "3px solid black",
                    borderRadius: "0.75rem",
                    backgroundColor: "white",
                    boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
                    fontSize: "1.1rem",
                    padding: "0.75rem 1.25rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "transform 0.08s ease",
                  }}
                >
                  Play Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
