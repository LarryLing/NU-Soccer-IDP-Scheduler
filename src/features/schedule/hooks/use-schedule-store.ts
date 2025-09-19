import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { getTrainingBlockIdsForPlayer, selectPlayerId, selectTrainingBlockId } from "../lib/schedule";
import type { ScheduleSettings } from "../schemas/schedule-settings.schema";

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

          const trainingBlocksForPlayers: Record<Player["id"], Set<TrainingBlock["id"]>> = {};
          const assignments: Record<Player["id"], Player["trainingBlockId"]> = {};

          players.forEach((player) => {
            trainingBlocksForPlayers[player.id] = new Set(getTrainingBlockIdsForPlayer(player, trainingBlocks));
            assignments[player.id] = null;
          });

          const seenPlayerIds = new Set<Player["id"]>();
          while (true) {
            const selectedPlayerId = selectPlayerId(seenPlayerIds, trainingBlocksForPlayers);
            if (!selectedPlayerId) break;

            const trainingBlocksForPlayer = trainingBlocksForPlayers[selectedPlayerId]!;
            if (trainingBlocksForPlayer.size === 0) {
              seenPlayerIds.add(selectedPlayerId);
              continue;
            }

            const selectedTrainingBlockId = selectTrainingBlockId(
              selectedPlayerId,
              assignments,
              trainingBlocksForPlayer,
              targetPlayerCount
            );

            assignments[selectedPlayerId] = selectedTrainingBlockId;
            seenPlayerIds.add(selectedPlayerId);
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
