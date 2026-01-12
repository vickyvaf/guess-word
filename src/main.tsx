import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { SettingsProvider } from "@/contexts/SettingsContext";
import BackgroundMusic from "@/components/BackgroundMusic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: {
              refetchOnWindowFocus: false,
            },
          },
        })
      }
    >
      <SettingsProvider>
        <div
          style={{
            position: "absolute",
            zIndex: -9999,
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <BackgroundMusic />
        </div>
        <RouterProvider router={router} />
      </SettingsProvider>
    </QueryClientProvider>
  </StrictMode>
);
