import {
  createRootRoute,
  Outlet,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { MathGridBg } from "@/components/background";
import { ModalLeaderboard } from "@/components/modal-leaderboard";
import { ModalSettings } from "@/components/modal-settings";
import { Button } from "@/uikits/button";
import { ChevronLeft } from "lucide-react";

export const Route = createRootRoute({
  component: () => {
    const location = useLocation();
    const router = useRouter();

    return (
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Outlet />
        <MathGridBg cell={30} major={30} />
        <ModalLeaderboard />
        <ModalSettings />

        {location.pathname !== "/" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 50,
            }}
          >
            <Button
              onClick={() => router.history.back()}
              rounded={true}
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                height: 64,
                width: 64,
                padding: 0,
                display: "grid",
                placeItems: "center",
              }}
            >
              <ChevronLeft size={40} />
            </Button>
          </div>
        )}
      </div>
    );
  },
});
