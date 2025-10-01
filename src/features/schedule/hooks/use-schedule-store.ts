import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { getTrainingBlockIdsForPlayer, selectTrainingBlockId } from "../lib/schedule";
import type { ScheduleSettings } from "../schemas/schedule-settings.schema";
import { Heap } from "../lib/heap";

export type ScheduleStoreActions = {
  getTrainingBlockById: (trainingBlockId: TrainingBlock["id"]) => TrainingBlock | null;
  saveScheduleSettings: (scheduleSettings: ScheduleSettings) => void;
  createSchedule: (players: Player[]) => Record<Player["id"], Player["trainingBlockId"]>;
};

export type UseScheduleStoreReturn = {
  trainingBlocks: TrainingBlock[];
  scheduleSettings: ScheduleSettings;
  actions: ScheduleStoreActions;
};

type HeapType = {
  playerId: Player["id"];
  trainingBlocksForPlayer: Set<TrainingBlock["id"]>;
};

const useScheduleStore = create<UseScheduleStoreReturn>()(
  persist(
    (set, get) => ({
      trainingBlocks: [],
      scheduleSettings: {
        availabilities: [],
        duration: 30,
        targetPlayerCount: 4,
      },
      actions: {
        getTrainingBlockById: (trainingBlockId) => {
          return get().trainingBlocks.find((trainingBlock) => trainingBlock.id === trainingBlockId) || null;
        },
        saveScheduleSettings: (scheduleSettings) => {
          set(() => ({ scheduleSettings }));
        },
        createSchedule: (players) => {
          const { trainingBlocks, scheduleSettings } = get();
          const { targetPlayerCount } = scheduleSettings;

          const assignments: Record<Player["id"], Player["trainingBlockId"]> = {};
          const trainingBlocksForPlayers = new Heap<HeapType>((a: HeapType, b: HeapType) => {
            return b.trainingBlocksForPlayer.size - a.trainingBlocksForPlayer.size;
          });

          players.forEach((player) => {
            trainingBlocksForPlayers.add({
              playerId: player.id,
              trainingBlocksForPlayer: new Set(getTrainingBlockIdsForPlayer(player, trainingBlocks)),
            });
            assignments[player.id] = null;
          });

          while (trainingBlocksForPlayers.peek()) {
            const { playerId: selectedPlayerId, trainingBlocksForPlayer } = trainingBlocksForPlayers.remove()!;

            console.log(trainingBlocksForPlayer.size);

            const selectedTrainingBlockId = selectTrainingBlockId(
              selectedPlayerId,
              assignments,
              trainingBlocksForPlayer,
              targetPlayerCount
            );

            assignments[selectedPlayerId] = selectedTrainingBlockId;
          }

          return assignments;
        },
      },
    }),
    {
      name: "schedule-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        trainingBlocks: state.trainingBlocks,
        scheduleSettings: state.scheduleSettings,
      }),
    }
  )
);

export const useTrainingBlocks = () => useScheduleStore((state) => state.trainingBlocks);
export const useScheduleSettings = () => useScheduleStore((state) => state.scheduleSettings);
export const useScheduleActions = () => useScheduleStore((state) => state.actions);
