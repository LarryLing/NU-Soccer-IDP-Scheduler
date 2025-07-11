import type { Player } from "@/lib/types";
import { useCallback, useState } from "react";

export const usePlayerSheet = () => {
  const [isPlayerSheetOpen, setIsPlayerSheetOpen] = useState<boolean>(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);

  const handleOpenPlayerSheet = useCallback((player: Player | null) => {
    setPlayerToEdit(player);
    setIsPlayerSheetOpen(true);
  }, []);

  return {
    isPlayerSheetOpen,
    setIsPlayerSheetOpen,
    handleOpenPlayerSheet,
    playerToEdit,
  };
};
