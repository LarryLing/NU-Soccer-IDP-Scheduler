import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Player } from "@/types/player.type";

export type UsePlayersStoreReturn = {
  players: Player[];
  setPlayers: (players: Player[]) => void;
};

const usePlayersStore = create<UsePlayersStoreReturn>()(
  persist(
    (set) => ({
      players: [],
      setPlayers: (players: Player[]) => {
        set(() => ({
          players,
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
