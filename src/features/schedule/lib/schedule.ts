import { DAYS } from "@/constants/days";
import type { Availability } from "@/types/availability.type";
import type { Day } from "@/constants/days";
import type { Player } from "@/features/players/types/player.type";
import type { TrainingBlock } from "@/features/schedule/types/training-block.type";
import { calculateCombinedScore } from "./math";
import { getTimeStringWithoutMeridian } from "@/lib/time";

export const createAllTrainingBlocks = (availabilities: Availability[], trainingBlockDuration: number) => {
  const createdTrainingBlocks: TrainingBlock[] = [];
  for (const day of DAYS) {
    const dayAvailabilities = availabilities.filter((availability) => availability.day === day);

    for (let i = 0; i < dayAvailabilities.length; i++) {
      let currentInt = dayAvailabilities[i]?.start_int ?? 0;
      const endInt = dayAvailabilities[i]?.end_int ?? 0;

      while (currentInt < endInt) {
        const createdTrainingBlock: TrainingBlock = {
          id: crypto.randomUUID(),
          day: day as Day,
          start: getTimeStringWithoutMeridian(currentInt),
          end: getTimeStringWithoutMeridian(currentInt + trainingBlockDuration),
          start_int: currentInt,
          end_int: currentInt + trainingBlockDuration,
        };

        createdTrainingBlocks.push(createdTrainingBlock);

        currentInt += trainingBlockDuration;
      }
    }
  }

  return createdTrainingBlocks;
};

const isPlayerAvailableForTrainingBlock = (player: Player, trainingBlock: TrainingBlock) => {
  return (player.availabilities as Availability[]).some((availability) => {
    return (
      availability.day === trainingBlock.day &&
      availability.start_int <= trainingBlock.start_int &&
      availability.end_int >= trainingBlock.end_int
    );
  });
};

const getTrainingBlockIdsForPlayer = (player: Player, trainingBlocks: TrainingBlock[]) => {
  return trainingBlocks
    .filter((trainingBlock) => isPlayerAvailableForTrainingBlock(player, trainingBlock))
    .map((trainingBlock) => trainingBlock.id);
};

export const assignPlayers = (players: Player[], trainingBlocks: TrainingBlock[], maximumPlayerCount: number) => {
  const playerAssignmentsMap = new Map<Player["id"], TrainingBlock["id"] | null>();
  players.forEach((player) => {
    playerAssignmentsMap.set(player.id, null);
  });

  const trainingBlockAssignedPlayerCounts: Record<TrainingBlock["id"], number> = {};
  trainingBlocks.forEach((block) => {
    trainingBlockAssignedPlayerCounts[block.id] = 0;
  });

  const availableTrainingBlockIdsMap = new Map<Player["id"], TrainingBlock["id"][]>();
  players.forEach((player) => {
    availableTrainingBlockIdsMap.set(player.id, getTrainingBlockIdsForPlayer(player, trainingBlocks));
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

  const unassignedPlayerNames = players
    .filter((player) => playerAssignmentsMap.get(player.id) === null)
    .map((player) => player.name);

  const usedTrainingBlocks = trainingBlocks.filter(
    (trainingBlock) => trainingBlockAssignedPlayerCounts[trainingBlock.id] || 0 > 0
  );

  return {
    unassignedPlayerNames,
    playerAssignmentsMap,
    usedTrainingBlocks,
  };
};

export const saveUsedTrainingBlocks = async (trainingBlocks: TrainingBlock[]) => {
  console.log("trainingBlocks", trainingBlocks);
  throw new Error("saveUsedTrainingBlocks is not implemented");

  // const { error: deleteError } = await supabase.from("training_blocks").delete().neq("id", crypto.randomUUID());

  // if (deleteError) {
  //   console.error("Error creating schedule", deleteError);
  //   throw deleteError;
  // }

  // const createTrainingBlockPromises = trainingBlocks.map((trainingBlock) =>
  //   supabase.from("training_blocks").insert(trainingBlock)
  // );

  // await Promise.all(createTrainingBlockPromises);
};

export const saveAssignedPlayers = async (playerAssignmentsMap: Map<Player["id"], TrainingBlock["id"] | null>) => {
  console.log("playerAssignmentsMap", playerAssignmentsMap);
  throw new Error("saveAssignedPlayers is not implemented");

  // const assignPlayerPromises = [];
  // for (const [playerId, trainingBlockId] of playerAssignmentsMap) {
  //   if (trainingBlockId === null) continue;
  //   assignPlayerPromises.push(
  //     supabase.from("players").update({ training_block_id: trainingBlockId }).eq("id", playerId)
  //   );
  // }

  // await Promise.all(assignPlayerPromises);
};
