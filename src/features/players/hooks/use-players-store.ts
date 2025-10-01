import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Player } from "@/schemas/player.schema";

export type PlayersStoreActions = {
  getPlayerByName: (playerName: Player["name"]) => Player | null;
  getPlayerById: (playerId: Player["id"]) => Player | null;
  getPlayersByTrainingBlockId: (trainingBlockId: Player["trainingBlockId"]) => Player[];
  createPlayer: (createdPlayer: Player) => void;
  updatePlayer: (updatedPlayer: Player) => void;
  assignPlayersToTrainingBlocks: (assignments: Record<Player["id"], Player["trainingBlockId"]>) => void;
  clearPlayerAvailabilities: (playerId: Player["id"]) => void;
  clearManyPlayerAvailabilities: (playerIds: Player["id"][]) => void;
  deletePlayer: (playerId: Player["id"]) => void;
  deleteManyPlayers: (playerIds: Player["id"][]) => void;
};

export type UsePlayersStoreReturn = {
  players: Player[];
  actions: PlayersStoreActions;
};

const usePlayersStore = create<UsePlayersStoreReturn>()(
  persist(
    (set, get) => ({
      players: [],
      actions: {
        getPlayerByName: (playerName) => {
          return get().players.find((player) => player.name === playerName) || null;
        },
        getPlayerById: (playerId) => {
          return get().players.find((player) => player.id === playerId) || null;
        },
        getPlayersByTrainingBlockId: (trainingBlockId) => {
          return [...get().players].filter((player) => player.trainingBlockId === trainingBlockId);
        },
        createPlayer: (createdPlayer) => {
          const updatedPlayers = [...get().players];

          let lastIndex = 0;
          for (let i = 0; i < updatedPlayers.length; i++) {
            const player = updatedPlayers[i];
            if (!player) break;
            if (player.number <= createdPlayer.number) lastIndex = i;
          }

          updatedPlayers.splice(lastIndex, 0, createdPlayer);

          set(() => ({ players: updatedPlayers }));
        },
        updatePlayer: (updatedPlayer) => {
          const updatedPlayers = [...get().players]
            .map((player) => {
              if (player.id === updatedPlayer.id) {
                return {
                  ...updatedPlayer,
                };
              }

              return player;
            })
            .sort((a, b) => a.number - b.number);

          set(() => ({ players: updatedPlayers }));
        },
        assignPlayersToTrainingBlocks: (assignments) => {
          const updatedPlayers = [...get().players].map((player) => {
            return {
              ...player,
              trainingBlockId: player.id in assignments ? assignments[player.id] || null : player.trainingBlockId,
            };
          });

          set(() => ({ players: updatedPlayers }));
        },
        clearPlayerAvailabilities: (playerId) => {
          const updatedPlayers = [...get().players].map((player) => {
            if (player.id === playerId) {
              return {
                ...player,
                availabilities: [],
              };
            }

            return player;
          });

          set(() => ({ players: updatedPlayers }));
        },
        clearManyPlayerAvailabilities: (playerIds) => {
          const uniquePlayerIds = new Set(playerIds);

          const updatedPlayers = [...get().players].map((player) => {
            if (uniquePlayerIds.has(player.id)) {
              return {
                ...player,
                availabilities: [],
              };
            }

            return player;
          });

          set(() => ({ players: updatedPlayers }));
        },
        deletePlayer: (playerId) => {
          const updatedPlayers = [...get().players].filter((player) => player.id !== playerId);
          set(() => ({ players: updatedPlayers }));
        },
        deleteManyPlayers: (playerIds) => {
          const uniquePlayerIds = new Set(playerIds);

          const updatedPlayers = [...get().players].filter((player) => !uniquePlayerIds.has(player.id));
          set(() => ({ players: updatedPlayers }));
        },
      },
    }),
    {
      name: "players-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        players: state.players,
      }),
    }
  )
);

export const usePlayers = () => usePlayersStore((state) => state.players);
export const usePlayersActions = () => usePlayersStore((state) => state.actions);
