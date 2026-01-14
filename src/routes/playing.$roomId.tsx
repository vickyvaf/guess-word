import { PlayingScreen } from "@/screens/playing-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/playing/$roomId")({
  component: () => {
    const { roomId } = Route.useParams();
    return <PlayingScreen roomId={roomId} />;
  },
});
