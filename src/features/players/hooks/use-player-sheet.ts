import { useCallback, useState } from "react";

import type { Player } from "@/schemas/player.schema";

import usePlayersStore from "./use-players-store";

export type UsePlayerSheetReturn = {
  player: Player | undefined;
  isPlayerSheetOpen: boolean;
  setIsPlayerSheetOpen: (isPlayerSheetOpen: boolean) => void;
  openPlayerSheet: (playerId?: Player["id"]) => void;
  closePlayerSheet: () => void;
};

export const usePlayerSheet = (): UsePlayerSheetReturn => {
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [isPlayerSheetOpen, setIsPlayerSheetOpen] = useState<boolean>(false);

  const openPlayerSheet = useCallback((playerId?: Player["id"]) => {
    if (playerId) {
      const { players } = usePlayersStore.getState();
      const player = players.find((player) => player.id === playerId);
      setPlayer(player);
    }

    setIsPlayerSheetOpen(true);
  }, []);

  const closePlayerSheet = useCallback(() => {
    setPlayer(undefined);
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
