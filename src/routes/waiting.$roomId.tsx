import { WaitingRoomScreen } from "@/screens/waiting-room-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/waiting/$roomId")({
  component: WaitingRoomScreen,
});
