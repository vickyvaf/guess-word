import { useState } from "react";
import { MathGridBg } from "@/components/background";
import { ChooseCategory } from "@/components/choose-category";
import { ModalLeaderboard } from "@/components/modal-leaderboard";
import { ModalSettings } from "@/components/modal-settings";
import { PlayingField } from "@/components/playing";
import { Button } from "@/uikits/button";

function App() {
  const [showContent, setShowContent] = useState("welcome");
  const [categorySelected, setCategorySelected] = useState("");

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          position: "absolute",
          display: showContent === "welcome" ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "2rem",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "1.5rem",
            maxWidth: "900px",
            lineHeight: 1.4,
            userSelect: "none",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
            }}
          >
            Welcome to the ultimate word guessing challenge!
          </span>
          <br />
          <br />
          <span>
            Try to uncover the hidden word by guessing letters before you run
            out of attempts.
          </span>
          <br />
          <span> Sharpen your vocabulary and have fun along the way!</span>
        </p>
        <Button
          onClick={() => {
            setShowContent("choose-category");
          }}
        >
          Play
        </Button>
      </div>
      {showContent === "choose-category" ? (
        <ChooseCategory
          onClick={setShowContent}
          setCategorySelected={setCategorySelected}
        />
      ) : null}
      {showContent === "playing" ? (
        <PlayingField
          categorySelected={categorySelected}
          setShowContent={setShowContent}
        />
      ) : null}
      <MathGridBg cell={30} major={30} />
      <ModalLeaderboard />
      <ModalSettings />
    </div>
  );
}

export default App;
