import { useContext } from "react";
import type { PlayersContextType } from "../lib/types.ts";
import { PlayersContext } from "@/contexts/players-context.tsx";

export const usePlayers = (): PlayersContextType => {
  const context = useContext(PlayersContext);

  if (context === undefined) {
    throw new Error("usePlayers must be used within a PlayersProvider");
  }

  return context;
};
