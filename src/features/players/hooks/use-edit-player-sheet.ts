import { useState } from "react";
import type { Player } from "@/types/player.type";

export type UseEditPlayerSheetReturn = {
  player: Player | undefined;
  setPlayer: (player: Player | undefined) => void;
  isEditPlayerSheetOpen: boolean;
  setIsEditPlayerSheetOpen: (isEditPlayerSheetOpen: boolean) => void;
};

export const useEditPlayerSheet = (): UseEditPlayerSheetReturn => {
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [isEditPlayerSheetOpen, setIsEditPlayerSheetOpen] = useState<boolean>(false);

  return {
    player,
    setPlayer,
    isEditPlayerSheetOpen,
    setIsEditPlayerSheetOpen,
  };
};
