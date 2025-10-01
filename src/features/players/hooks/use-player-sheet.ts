import { useCallback, useState } from "react";

import type { Player } from "@/schemas/player.schema";

import { usePlayersActions } from "./use-players-store";

export type UsePlayerSheetReturn = {
  player: Player | null;
  isPlayerSheetOpen: boolean;
  setIsPlayerSheetOpen: (isPlayerSheetOpen: boolean) => void;
  openPlayerSheet: (playerId?: Player["id"]) => void;
  closePlayerSheet: () => void;
};

export const usePlayerSheet = (): UsePlayerSheetReturn => {
  const { getPlayerById } = usePlayersActions();

  const [player, setPlayer] = useState<Player | null>(null);
  const [isPlayerSheetOpen, setIsPlayerSheetOpen] = useState<boolean>(false);

  const openPlayerSheet = (playerId?: Player["id"]) => {
    setPlayer(playerId ? getPlayerById(playerId) : null);
    setIsPlayerSheetOpen(true);
  };

  const closePlayerSheet = useCallback(() => {
    setPlayer(null);
    setIsPlayerSheetOpen(false);
  }, []);

  return {
    player,
    isPlayerSheetOpen,
    setIsPlayerSheetOpen,
    openPlayerSheet,
    closePlayerSheet,
  };
};
