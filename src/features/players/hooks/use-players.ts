import { useState, useCallback } from "react";
import type { Player } from "@/types/player.type";

export type UsePlayersReturn = {
  players: Player[];
  createPlayer: (player: Player) => Promise<void>;
  updatePlayer: (player: Player) => Promise<void>;
  deletePlayer: (playerId: string) => Promise<void>;
};

export const usePlayers = (): UsePlayersReturn => {
  const [players, setPlayers] = useState<Player[]>([]);

  const createPlayer = useCallback(async (player: Player) => {
    setPlayers((prev) => [...prev, player]);
  }, []);

  const updatePlayer = useCallback(async (player: Player) => {
    setPlayers((prev) => prev.map((p) => (p.id === player.id ? player : p)));
  }, []);

  const deletePlayer = useCallback(async (playerId: string) => {
    setPlayers((prev) => prev.filter((player) => player.id !== playerId));
  }, []);

  return { players, createPlayer, updatePlayer, deletePlayer };
};
