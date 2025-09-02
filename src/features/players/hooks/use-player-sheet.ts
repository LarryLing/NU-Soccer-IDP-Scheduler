import { useState, useCallback } from "react";
import type { Player } from "@/types/player.type";

export type UsePlayersSheetReturn = {
  playerMetadata: Pick<Player, "id" | "training_block_id"> | null;
  isPlayerSheetOpen: boolean;
  setIsPlayerSheetOpen: (isPlayerSheetOpen: boolean) => void;
  openPlayerSheet: (playerId: string | null) => void;
};

export const usePlayerSheet = (players: Player[]): UsePlayersSheetReturn => {
  const [playerMetadata, setPlayerMetadata] = useState<Pick<Player, "id" | "training_block_id"> | null>(null);
  const [isPlayerSheetOpen, setIsPlayerSheetOpen] = useState<boolean>(false);

  const openPlayerSheet = useCallback(
    (playerId: string | null) => {
      if (playerId) {
        const player = players.find((player) => player.id === playerId);
        if (!player) return;

        setPlayerMetadata(player);
      } else {
        setPlayerMetadata(null);
      }

      setIsPlayerSheetOpen(true);
    },
    [players]
  );

  return {
    playerMetadata,
    isPlayerSheetOpen,
    setIsPlayerSheetOpen,
    openPlayerSheet,
  };
};
