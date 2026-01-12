import { useState } from "react";
import { Button } from "@/uikits/button";
import { Modal } from "@/uikits/modal";
import { SettingsIcon } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export function ModalSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signInWithGoogle, signOut, loading } = useSettings();

  const renderButtonIcon = () => {
    if (loading) {
      return <SettingsIcon width={40} height={40} />;
    }

    if (user) {
      return (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "3px solid black",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            display: "grid",
            placeItems: "center",
            position: "relative",
            overflow: "hidden",
            background: user.user_metadata?.avatar_url
              ? `url(${user.user_metadata.avatar_url}) center/cover no-repeat`
              : "#3b82f6",
          }}
        >
          {/* White inner ring */}
          <div
            style={{
              position: "absolute",
              width: "calc(100% - 6px)",
              height: "calc(100% - 6px)",
              borderRadius: "50%",
              border: "2px solid white",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        </div>
      );
    }

    return <SettingsIcon width={40} height={40} />;
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        rounded={true}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          height: 64,
          width: 64,
          padding: 0,
          display: "grid",
          placeItems: "center",
        }}
        icon={renderButtonIcon()}
      />

      {isOpen ? (
        <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Settings">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {loading ? (
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                  Loading...
                </span>
              </div>
            ) : user ? (
              <>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    border: "2px solid black",
                    display: "grid",
                    placeItems: "center",
                    background: user.user_metadata?.avatar_url
                      ? `url(${user.user_metadata.avatar_url}) center/cover`
                      : "#3b82f6",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: user.user_metadata?.avatar_url
                      ? "transparent"
                      : "white",
                  }}
                >
                  {user.user_metadata?.avatar_url
                    ? ""
                    : user.user_metadata?.full_name
                      ? user.user_metadata.full_name[0]
                      : "?"}
                </div>

                <div
                  style={{
                    display: "grid",
                    lineHeight: 1.2,
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>
                    {user.user_metadata?.full_name}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                    {user.email}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    onClick={signOut}
                    style={{
                      border: "2px solid black",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      background: "var(--button-bg)",
                      boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "2px solid black",
                    display: "grid",
                    placeItems: "center",
                    background: "#f3f4f6",
                    fontWeight: 700,
                  }}
                  title="Not connected"
                >
                  {"?"}
                </div>

                <div
                  style={{
                    display: "grid",
                    lineHeight: 1.2,
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{"Not connected"}</span>
                  <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                    {"Connect your Google account"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    onClick={signInWithGoogle}
                    style={{
                      border: "2px solid black",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      background: "white",
                      boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "1rem",
                    }}
                  >
                    {/* Google "G" mini (inline SVG) */}
                    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
                      <path
                        fill="#FFC107"
                        d="M43.6 20.5H42V20H24v8h11.3C33.8 31.9 29.3 35 24 35 16.8 35 11 29.2 11 22s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.6 3.4 29.6 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22 22-9.8 22-22c0-1.5-.2-3-.4-4.5z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.3 14.7l6.6 4.8C14.7 16 18.9 13 24 13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.6 7.4 29.6 5 24 5c-7.4 0-13.7 4.2-17 10.4z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 41c5.2 0 9.8-1.7 13.1-4.7l-6.1-5c-2 1.4-4.7 2.2-7 2.2-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.4 36.6 16.1 41 24 41z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.3-3.8 5.9-7.3 6.9l6.1 5c3.6-3.3 5.9-8.1 5.9-13.9 0-1.5-.2-3-.4-4.5z"
                      />
                    </svg>
                    Connect Google
                  </Button>
                </div>
              </>
            )}
          </div>

          <MainVolumeSlider />
          <BackgroundMusicVolumeSlider />
        </Modal>
      ) : null}
    </>
  );
}

function MainVolumeSlider() {
  const { volume, setVolume } = useSettings();

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <label style={{ display: "grid", gap: "0.5rem" }}>
        <span style={{ fontWeight: 600 }}>Volume: {volume}%</span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          style={{
            width: "100%",
            height: "8px",
            borderRadius: "6px",
            background: `linear-gradient(to right, #3b82f6 ${volume}%, #e5e7eb ${volume}%)`,
            outline: "none",
            cursor: "grab",
            accentColor: "#3b82f6", // warna thumb modern browser
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.cursor = "grabbing";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.cursor = "grab";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.cursor = "grab";
          }}
        />
      </label>
    </div>
  );
}

function BackgroundMusicVolumeSlider() {
  const { backgroundMusicVolume, setBackgroundMusicVolume } = useSettings();

  return (
    <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
      <label style={{ display: "grid", gap: "0.5rem" }}>
        <span style={{ fontWeight: 600 }}>
          Background Music: {backgroundMusicVolume}%
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={backgroundMusicVolume}
          onChange={(e) => setBackgroundMusicVolume(parseInt(e.target.value))}
          style={{
            width: "100%",
            height: "8px",
            borderRadius: "6px",
            background: `linear-gradient(to right, #3b82f6 ${backgroundMusicVolume}%, #e5e7eb ${backgroundMusicVolume}%)`,
            outline: "none",
            cursor: "grab",
            accentColor: "#3b82f6",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.cursor = "grabbing";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.cursor = "grab";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.cursor = "grab";
          }}
        />
      </label>
    </div>
  );
}
