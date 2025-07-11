import { createContext } from "react";
import type { PlayersContextType } from "@/lib/types.ts";

export const PlayersContext = createContext<PlayersContextType | undefined>(
  undefined,
);
