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
