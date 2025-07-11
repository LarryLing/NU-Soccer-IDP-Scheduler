import { useContext } from "react";
import type { PlayerSheetContextType } from "../lib/types.ts";
import { PlayerSheetContext } from "@/contexts/player-sheet-context.tsx";

export const usePlayerSheet = (): PlayerSheetContextType => {
  const context = useContext(PlayerSheetContext);

  if (context === undefined) {
    throw new Error("usePlayerSheet must be used within a PlayerSheetProvider");
  }

  return context;
};
