import { useSettings } from "@/contexts/SettingsContext";
import { services } from "@/supabase/service";
import { Modal } from "@/uikits/modal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const getRankStyle = (rank: number) => {
  const isTop1 = rank === 1;
  const isTop2 = rank === 2;
  const isTop3 = rank === 3;

  return {
    fontSize: isTop1
      ? "1.5rem"
      : isTop2
        ? "1.4rem"
        : isTop3
          ? "1.3rem"
          : "1.25rem",
    fontWeight: 700,
    width: "2rem",
    textAlign: "center" as const,
    color: isTop1
      ? "#FFD700"
      : isTop2
        ? "#C0C0C0"
        : isTop3
          ? "#CD7F32"
          : "var(--modal-text)",
    opacity: isTop1 || isTop2 || isTop3 ? 1 : 0.7,
  };
};

export function ModalLeaderboard() {
  const { user } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [shouldAnimate] = useState(
    () => performance.now() < 2000 && window.location.pathname === "/"
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => services.users.getLeaderboards(),
    enabled: isOpen,
  });

  const { data: meData } = useQuery({
    queryKey: ["me", isOpen],
    queryFn: () => services.users.getMe(),
    enabled: isOpen,
  });

  return (
    <>
      <img
        src="/champion.png"
        className={`logo ${shouldAnimate ? "fade-in-delayed" : ""}`}
        alt="Leaderboard"
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
        onClick={() => {
          setIsOpen(true);
        }}
      />

      {isOpen ? (
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Leaderboard"
        >
          {error ? (
            <div style={{ textAlign: "center", padding: "2rem", opacity: 0.7 }}>
              Error: {error.message}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              maxHeight: "70vh", // Increased height to accommodate "Me" section
              marginTop: "1rem",
            }}
          >
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      background: "var(--input-bg)",
                      border: "2px solid var(--input-border)",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: "2rem",
                          height: "1.5rem",
                          borderRadius: "4px",
                        }}
                        className="shimmer"
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                          }}
                          className="shimmer"
                        />
                        <div
                          style={{
                            width: "50%",
                            height: "1rem",
                            borderRadius: "4px",
                          }}
                          className="shimmer"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        width: "60px",
                        height: "1.5rem",
                        borderRadius: "20px",
                      }}
                      className="shimmer"
                    />
                  </div>
                ))}
              </div>
            ) : !data?.users?.length ? (
              <div
                style={{ textAlign: "center", padding: "2rem", opacity: 0.7 }}
              >
                No players found
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    overflowY: "auto",
                    flex: 1,
                  }}
                >
                  {data.users.map((user, index) => {
                    const rank = index + 1;

                    return (
                      <div
                        key={user.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          background: "var(--input-bg)",
                          border: "2px solid var(--input-border)",
                          borderRadius: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            flex: 1,
                          }}
                        >
                          <span style={getRankStyle(rank)}>{rank}</span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                            }}
                          >
                            <img
                              src={
                                user.avatar_url ||
                                user.picture ||
                                "/default-avatar.jpg"
                              }
                              alt={user.full_name}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid var(--input-border)",
                              }}
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  user.full_name
                                )}&background=random`;
                              }}
                            />
                            <span style={{ fontWeight: 500, fontSize: "1rem" }}>
                              {user.full_name ||
                                getFallbackFullNameById(user?.id)}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            color: "var(--button-text)",
                            background: "var(--button-shadow)",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "20px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.total_points || 0} pts
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(meData?.user || (user && data?.users)) && (
                  <div
                    style={{
                      borderTop: "1px solid var(--input-border)",
                      paddingTop: "1rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem 1rem",
                        background: "var(--button-bg)", // Slightly different bg to highlight
                        border: "2px solid var(--input-border-focus)", // Highlight border
                        borderRadius: "12px",
                      }}
                    >
                      {(() => {
                        const meInList = data?.users?.find(
                          (u) => u.id === user?.id
                        );
                        const meInListRank = meInList
                          ? data.users.indexOf(meInList) + 1
                          : null;

                        const displayMe = meInList || meData?.user;
                        const displayRank = meInListRank || meData?.rank;

                        if (!displayMe) return null;

                        return (
                          <>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                flex: 1,
                              }}
                            >
                              <span style={getRankStyle(displayRank || 0)}>
                                {displayRank || "-"}
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.75rem",
                                }}
                              >
                                <img
                                  src={
                                    displayMe.avatar_url ||
                                    displayMe.picture ||
                                    "/default-avatar.jpg"
                                  }
                                  alt={displayMe.full_name}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "2px solid var(--input-border)",
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      displayMe.full_name
                                    )}&background=random`;
                                  }}
                                />
                                <span
                                  style={{ fontWeight: 500, fontSize: "1rem" }}
                                >
                                  {displayMe.full_name} (Me)
                                </span>
                              </div>
                            </div>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                color: "var(--button-text)",
                                background: "var(--button-shadow)",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "20px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {displayMe.total_points || 0} pts
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Modal>
      ) : null}
    </>
  );
}

function getFallbackFullNameById(s: string) {
  return `Player-${s.split("-")[0]}`;
}
