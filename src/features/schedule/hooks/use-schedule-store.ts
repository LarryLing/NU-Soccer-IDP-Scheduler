import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { DAYS } from "@/constants/days";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { getTrainingBlockIdsForPlayer, selectRandomAvailablePlayer, selectRandomTrainingBlock } from "../lib/schedule";
import type { ScheduleSettings } from "../schemas/schedule-settings.schema";

export type ScheduleStoreActions = {
  getTrainingBlockById: (trainingBlockId: TrainingBlock["id"]) => TrainingBlock | null;
  saveScheduleSettingsAndGenerateTrainingBlocks: (scheduleSettings: ScheduleSettings) => void;
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
        saveScheduleSettingsAndGenerateTrainingBlocks: (scheduleSettings) => {
          const { availabilities, duration } = scheduleSettings;

          const generatedTrainingBlocks: TrainingBlock[] = [];

          DAYS.forEach((day) => {
            const dayAvailabilities = availabilities.filter((availability) => availability.day === day);

            dayAvailabilities.forEach((dayAvailability) => {
              let currentInt = dayAvailability.start;
              const endInt = dayAvailability.end;

              while (currentInt < endInt) {
                const createdTrainingBlock: TrainingBlock = {
                  id: crypto.randomUUID(),
                  day,
                  start: currentInt,
                  end: currentInt + duration,
                };

                generatedTrainingBlocks.push(createdTrainingBlock);

                currentInt += duration;
              }
            });
          });

          set(() => ({
            scheduleSettings,
            trainingBlocks: generatedTrainingBlocks,
          }));
        },
        createSchedule: (players) => {
          const { trainingBlocks, scheduleSettings } = get();
          const { targetPlayerCount } = scheduleSettings;

          const availablePlayers: Player[] = [];
          const availableTrainingBlocks: TrainingBlock[] = [...trainingBlocks];

          const assignments: Record<Player["id"], Player["trainingBlockId"]> = {};

          players.forEach((player) => {
            const trainingBlocksForPlayer = getTrainingBlockIdsForPlayer(player, trainingBlocks);
            if (trainingBlocksForPlayer.length > 0) availablePlayers.push(player);
            assignments[player.id] = null;
          });

          while (availablePlayers.length > 0 && availableTrainingBlocks.length > 0) {
            const { selectedTrainingBlock, selectedTrainingBlockIndex } =
              selectRandomTrainingBlock(availableTrainingBlocks);

            let playerCount = 0;
            while (playerCount < targetPlayerCount && availablePlayers.length > 0) {
              const result = selectRandomAvailablePlayer(
                availablePlayers,
                selectedTrainingBlock,
                availableTrainingBlocks
              );
              if (!result) break;
              const { selectedPlayer, selectedPlayerIndex } = result;

              assignments[selectedPlayer.id] = selectedTrainingBlock.id;
              availablePlayers.splice(selectedPlayerIndex, 1);
              playerCount += 1;
            }

            availableTrainingBlocks.splice(selectedTrainingBlockIndex, 1);
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
