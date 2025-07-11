import { createContext } from "react";
import type { PlayerSheetContextType } from "@/lib/types.ts";

export const PlayerSheetContext = createContext<
  PlayerSheetContextType | undefined
>(undefined);
