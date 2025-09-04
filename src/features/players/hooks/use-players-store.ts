import type { Player } from "@/features/players/types/player.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UsePlayersStoreReturn = {
  players: Player[];
  createPlayer: (player: Pick<Player, "name" | "number" | "position" | "availabilities">) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (playerId: string) => void;
};

const usePlayersStore = create<UsePlayersStoreReturn>()(
  persist(
    (set) => ({
      players: [],
      createPlayer: (player) => {
        set((state) => ({
          players: [...state.players, { id: crypto.randomUUID(), training_block_id: null, ...player }],
        }));
      },
      updatePlayer: (player) => {
        set((state) => ({
          players: state.players.map((p) => (p.id === player.id ? player : p)),
        }));
      },
      deletePlayer: (playerId) => {
        set((state) => ({
          players: state.players.filter((player) => player.id !== playerId),
        }));
      },
    }),
    {
      name: "players-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default usePlayersStore;
