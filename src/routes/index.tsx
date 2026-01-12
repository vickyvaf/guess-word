import { HomeScreen } from "@/screens/home-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeScreen,
});
