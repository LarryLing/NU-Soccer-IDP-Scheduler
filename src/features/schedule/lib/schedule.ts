import { DAYS } from "@/constants/days";
import type { Day } from "@/constants/days";
import usePlayersStore from "@/features/players/hooks/use-players-store";
import type { Availability } from "@/schemas/availability.schema";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import useScheduleStore from "../hooks/use-schedule-store";

import { calculateCombinedScore } from "./math";

export const generatePossibleTrainingBlocks = (availabilities: Availability[], trainingBlockDuration: number) => {
  const possibleTrainingBlocks: TrainingBlock[] = [];
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
        };

        possibleTrainingBlocks.push(createdTrainingBlock);

        currentInt += trainingBlockDuration;
      }
    }
  }

  return possibleTrainingBlocks;
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

export const assignPlayersToTrainingBlocks = (possibleTrainingBlocks: TrainingBlock[], maximumPlayerCount: number) => {
  const players = usePlayersStore.getState().players;

  const playerAssignmentsMap = new Map<Player["id"], TrainingBlock["id"] | null>();
  players.forEach((player) => {
    playerAssignmentsMap.set(player.id, null);
  });

  const trainingBlockAssignedPlayerCounts: Record<TrainingBlock["id"], number> = {};
  possibleTrainingBlocks.forEach((possibleTrainingBlock) => {
    trainingBlockAssignedPlayerCounts[possibleTrainingBlock.id] = 0;
  });

  const availableTrainingBlockIdsMap = new Map<Player["id"], TrainingBlock["id"][]>();
  players.forEach((player) => {
    availableTrainingBlockIdsMap.set(player.id, getTrainingBlockIdsForPlayer(player, possibleTrainingBlocks));
  });

  const sortedPlayers = [...players].sort((a, b) => {
    const aBlocks = availableTrainingBlockIdsMap.get(a.id)?.length || 0;
    const bBlocks = availableTrainingBlockIdsMap.get(b.id)?.length || 0;
    return aBlocks - bBlocks;
  });

  for (const player of sortedPlayers) {
    const availableBlockIds = availableTrainingBlockIdsMap.get(player.id) || [];
    if (availableBlockIds.length === 0) continue;

    let bestBlockIds: TrainingBlock["id"][] = [];
    let bestScore = -Infinity;

    for (const blockId of availableBlockIds) {
      const tempCounts = { ...trainingBlockAssignedPlayerCounts };
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
      if (!bestBlockId) continue;

      playerAssignmentsMap.set(player.id, bestBlockId);
      trainingBlockAssignedPlayerCounts[bestBlockId]!++;
    }
  }

  const usedTrainingBlocks = possibleTrainingBlocks.filter(
    (possibleTrainingBlock) => (trainingBlockAssignedPlayerCounts[possibleTrainingBlock.id] || 0) > 0
  );

  return {
    playerAssignmentsMap,
    usedTrainingBlocks,
  };
};

export const saveUsedTrainingBlocks = async (trainingBlocks: TrainingBlock[]) => {
  const { setTrainingBlocks } = useScheduleStore.getState();

  setTrainingBlocks(trainingBlocks);
};

export const saveAssignedPlayers = async (playerAssignmentsMap: Map<Player["id"], TrainingBlock["id"] | null>) => {
  const players = usePlayersStore.getState().players;
  const setPlayers = usePlayersStore.getState().setPlayers;

  const updatedPlayers = [...players].map((player) => {
    return {
      ...player,
      trainingBlockId: playerAssignmentsMap.get(player.id) || null,
    };
  });

  setPlayers(updatedPlayers);
};
