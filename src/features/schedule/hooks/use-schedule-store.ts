import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { DAYS } from "@/constants/days";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { calculateCombinedScore } from "../lib/math";
import { getTrainingBlockIdsForPlayer } from "../lib/schedule";
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
        maximumPlayerCount: 4,
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
          const { maximumPlayerCount } = scheduleSettings;

          const assignedPlayerCounts: Record<TrainingBlock["id"], number> = {};
          trainingBlocks.forEach((trainingBlock) => {
            assignedPlayerCounts[trainingBlock.id] = 0;
          });

          const availableTrainingBlockIdsMap: Record<Player["id"], TrainingBlock["id"][]> = {};
          players.forEach((player) => {
            availableTrainingBlockIdsMap[player.id] = getTrainingBlockIdsForPlayer(player, trainingBlocks);
          });

          const assignments: Record<Player["id"], Player["trainingBlockId"]> = {};

          [...players]
            .sort((a, b) => {
              const aBlocks = availableTrainingBlockIdsMap[a.id]?.length || 0;
              const bBlocks = availableTrainingBlockIdsMap[b.id]?.length || 0;
              return aBlocks - bBlocks;
            })
            .forEach((player) => {
              const availableBlockIds = availableTrainingBlockIdsMap[player.id] || [];
              if (availableBlockIds.length === 0) {
                assignments[player.id] = null;
                return;
              }

              let bestBlockIds: TrainingBlock["id"][] = [];
              let bestScore = -Infinity;

              for (const blockId of availableBlockIds) {
                const tempCounts = { ...assignedPlayerCounts };
                tempCounts[blockId]!++;

                const score = calculateCombinedScore(tempCounts, maximumPlayerCount);

                if (bestScore < score) {
                  bestScore = score;
                  bestBlockIds = [blockId];
                } else if (bestScore === score) {
                  bestBlockIds.push(blockId);
                }
              }

              if (bestBlockIds.length > 0) {
                const randomBlockIndex = Math.floor(Math.random() * bestBlockIds.length);

                const bestBlockId = bestBlockIds[randomBlockIndex] || null;
                assignments[player.id] = bestBlockId;

                if (bestBlockId) assignedPlayerCounts[bestBlockId]!++;

                return;
              }

              assignments[player.id] = null;
            });

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
