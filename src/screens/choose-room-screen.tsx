
export function ChooseRoomScreen() {
    return (
        <section style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            userSelect: "none",
            zIndex: 1000,
        }}>
            <h1 style={{
                fontSize: "2rem",
                fontWeight: "bold",
                textAlign: "center",
                margin: 0,
            }}>Choose Room</h1>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
                backgroundColor: "white",
                borderRadius: "1rem",
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                userSelect: "none",
                zIndex: 1000,
            }}>A</div>
        </section>
    )
  }