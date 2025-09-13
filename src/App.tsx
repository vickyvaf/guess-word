function MathGridBg({
  cell = 32,
  major = 160,
}: {
  cell?: number;
  major?: number;
}) {
  const style = {
    width: "100vw",
    height: "100vh",
    backgroundImage: `
      linear-gradient(to right, rgba(59,130,246,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(59,130,246,0.05) 1px, transparent 1px),
      linear-gradient(to right, rgba(37,99,235,0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(37,99,235,0.1) 1px, transparent 1px)
    `,
    backgroundSize: `
      ${cell}px ${cell}px,
      ${cell}px ${cell}px,
      ${major}px ${major}px,
      ${major}px ${major}px
    `,
  } as const;

  return <div style={style} />;
}

function App() {
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
          display: "flex",
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
            maxWidth: "800px",
            lineHeight: 1.4,
            userSelect: "none",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
            }}
          >
            Welcome to the ultimate word guessing challenge!
          </span>
          <br />
          <br />
          Try to uncover the hidden word by guessing letters before you run out
          of attempts. Sharpen your vocabulary and have fun along the way!
        </p>
        <h1
          style={{
            width: "fit-content",
            margin: 0,
            fontSize: "3rem",
            lineHeight: 1.1,
            cursor: "pointer",
            border: "4px solid black",
            padding: "1rem 3rem",
            borderRadius: "0.5em",
            backgroundColor: "white",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
            userSelect: "none",
            transition: "transform 0.1s ease",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Play
        </h1>
      </div>
      <img
        src="/champion.png"
        className="logo"
        alt="Logo"
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          cursor: "pointer",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        width={100}
        height={100}
      />
      <img
        src="/gear.png"
        className="logo"
        alt="Logo"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          borderRadius: "100%",
          border: "2px solid black",
          padding: "0.5rem",
          backgroundColor: "white",
          boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
          transition: "transform 0.1s ease",
          cursor: "pointer",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        width={50}
        height={50}
      />
      <MathGridBg cell={30} major={30} />;
    </div>
  );
}

export default App;
