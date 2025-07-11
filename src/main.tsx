import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./contexts/auth-provider";
import { usePlayers } from "./hooks/usePlayers";
import { PlayersProvider } from "./contexts/players-provider";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    players: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  const players = usePlayers();
  return <RouterProvider router={router} context={{ auth, players }} />;
}

function App() {
  return (
    <AuthProvider>
      <PlayersProvider>
        <InnerApp />
      </PlayersProvider>
    </AuthProvider>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
