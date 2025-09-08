import { DAYS } from "@/constants/days";
import type { Day } from "@/constants/days";
import usePlayersStore from "@/features/players/hooks/use-players-store";
import type { Availability } from "@/schemas/availability.schema";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import useScheduleStore from "../hooks/use-schedule-store";

import { calculateCombinedScore } from "./math";

export const generateTrainingBlocks = (availabilities: Availability[], trainingBlockDuration: number) => {
  const trainingBlocks: TrainingBlock[] = [];
  for (const day of DAYS) {
    const dayAvailabilities = availabilities.filter((availability) => availability.day === day);

    for (let i = 0; i < dayAvailabilities.length; i++) {
      let currentInt = dayAvailabilities[i]?.start ?? 0;
      const endInt = dayAvailabilities[i]?.end ?? 0;

      while (currentInt < endInt) {
        const createdTrainingBlock: TrainingBlock = {
          id: crypto.randomUUID(),
          day: day as Day,
          start: currentInt,
          end: currentInt + trainingBlockDuration,
          assignedPlayerCount: 0,
        };

        trainingBlocks.push(createdTrainingBlock);

        currentInt += trainingBlockDuration;
      }
    }
  }

  return trainingBlocks;
};

export const isPlayerAvailableForTrainingBlock = (player: Player, trainingBlock: TrainingBlock) => {
  return (player.availabilities as Availability[]).some((availability) => {
    return (
      availability.day === trainingBlock.day &&
      availability.start <= trainingBlock.start &&
      availability.end >= trainingBlock.end
    );
  });
};

const getTrainingBlockIdsForPlayer = (player: Player, trainingBlocks: TrainingBlock[]) => {
  return trainingBlocks
    .filter((trainingBlock) => isPlayerAvailableForTrainingBlock(player, trainingBlock))
    .map((trainingBlock) => trainingBlock.id);
};

export const assignPlayersToTrainingBlocks = () => {
  const { players } = usePlayersStore.getState();
  const { trainingBlocks, scheduleSettings } = useScheduleStore.getState();
  const { maximumPlayerCount } = scheduleSettings;

  const assignedPlayerCounts: Record<TrainingBlock["id"], TrainingBlock["assignedPlayerCount"]> = {};
  trainingBlocks.forEach((trainingBlock) => {
    assignedPlayerCounts[trainingBlock.id] = 0;
  });

  const availableTrainingBlockIdsMap: Record<Player["id"], TrainingBlock["id"][]> = {};
  players.forEach((player) => {
    availableTrainingBlockIdsMap[player.id] = getTrainingBlockIdsForPlayer(player, trainingBlocks);
  });

  const updatedPlayers = [...players]
    .sort((a, b) => {
      const aBlocks = availableTrainingBlockIdsMap[a.id]?.length || 0;
      const bBlocks = availableTrainingBlockIdsMap[b.id]?.length || 0;
      return aBlocks - bBlocks;
    })
    .map((player) => {
      const availableBlockIds = availableTrainingBlockIdsMap[player.id] || [];
      if (availableBlockIds.length === 0) {
        return {
          ...player,
          trainingBlockId: null,
        };
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

        const bestBlockId = bestBlockIds[randomBlockIndex];
        if (!bestBlockId) {
          return {
            ...player,
            trainingBlockId: null,
          };
        }

        assignedPlayerCounts[bestBlockId]!++;

        return {
          ...player,
          trainingBlockId: bestBlockId,
        };
      }

      return {
        ...player,
        trainingBlockId: null,
      };
    });

  return { updatedPlayers, assignedPlayerCounts };
};
