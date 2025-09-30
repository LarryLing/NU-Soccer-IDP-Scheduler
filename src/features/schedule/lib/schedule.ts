import type { Availability } from "@/schemas/availability.schema";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

export const isPlayerAvailableForTrainingBlock = (player: Player, trainingBlock: TrainingBlock) => {
  return (player.availabilities as Availability[]).some((availability) => {
    return (
      availability.day === trainingBlock.day &&
      availability.start <= trainingBlock.start &&
      availability.end >= trainingBlock.end
    );
  });
};

export const getTrainingBlockIdsForPlayer = (player: Player, trainingBlocks: TrainingBlock[]) => {
  return trainingBlocks
    .filter((trainingBlock) => isPlayerAvailableForTrainingBlock(player, trainingBlock))
    .map((trainingBlock) => trainingBlock.id);
};

export const calculateTrainingBlockHeuristic = (playerCount: number, targetPlayerCount: number) => {
  const k = 1;
  const x = playerCount;
  const t = targetPlayerCount;

  if (0 <= x && x <= t) {
    return k * (x / t) ** 2;
  } else {
    return k * (1 / (x * t)) ** (x - t);
  }
};

export const calculateStateHeuristic = (
  assignments: Record<Player["id"], Player["trainingBlockId"]>,
  targetPlayerCount: number
) => {
  const assignedTrainingBlockCounts: Record<TrainingBlock["id"], number> = {};

  Object.values(assignments).forEach((trainingBlockId) => {
    if (!trainingBlockId) return;

    if (trainingBlockId in assignedTrainingBlockCounts) {
      assignedTrainingBlockCounts[trainingBlockId]! += 1;
    } else {
      assignedTrainingBlockCounts[trainingBlockId] = 1;
    }
  });

  let stateHeuristic = 0;
  Object.values(assignedTrainingBlockCounts).forEach(
    (playerCount) => (stateHeuristic += calculateTrainingBlockHeuristic(playerCount, targetPlayerCount))
  );
  return stateHeuristic;
};

export const selectTrainingBlockId = (
  selectedPlayerId: Player["id"],
  assignments: Record<Player["id"], Player["trainingBlockId"]>,
  trainingBlocksForPlayer: Set<TrainingBlock["id"]>,
  targetPlayerCount: number
) => {
  let maxStateHeuristic = Number.NEGATIVE_INFINITY;
  const candidateTrainingBlockIds = [];

  for (const trainingBlockId of trainingBlocksForPlayer) {
    const tempAssignments: Record<Player["id"], Player["trainingBlockId"]> = { ...assignments };
    tempAssignments[selectedPlayerId] = trainingBlockId;

    const stateHeuristic = calculateStateHeuristic(tempAssignments, targetPlayerCount);
    if (stateHeuristic > maxStateHeuristic) {
      maxStateHeuristic = stateHeuristic;
      candidateTrainingBlockIds.length = 0;
      candidateTrainingBlockIds.push(trainingBlockId);
    } else if (stateHeuristic === maxStateHeuristic) {
      candidateTrainingBlockIds.push(trainingBlockId);
    }
  }

  const randomIndex = Math.floor(Math.random() * candidateTrainingBlockIds.length);
  return candidateTrainingBlockIds[randomIndex] || null;
};
