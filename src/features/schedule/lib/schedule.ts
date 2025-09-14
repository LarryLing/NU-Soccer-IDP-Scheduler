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

export const selectRandomTrainingBlock = (availableTrainingBlocks: TrainingBlock[]) => {
  const selectedTrainingBlockIndex = Math.floor(Math.random() * availableTrainingBlocks.length);
  const selectedTrainingBlock = availableTrainingBlocks[selectedTrainingBlockIndex];
  return { selectedTrainingBlock: selectedTrainingBlock!, selectedTrainingBlockIndex };
};

export const selectRandomAvailablePlayer = (
  availablePlayers: Player[],
  selectedTrainingBlock: TrainingBlock,
  availableTrainingBlocks: TrainingBlock[]
) => {
  const playersForTrainingBlock = availablePlayers.filter((availablePlayer) =>
    isPlayerAvailableForTrainingBlock(availablePlayer, selectedTrainingBlock)
  );

  if (playersForTrainingBlock.length === 0) return null;

  const availabilityCounts = playersForTrainingBlock.map(
    (player) => getTrainingBlockIdsForPlayer(player, availableTrainingBlocks).length
  );

  const maxAvailability = Math.max(...availabilityCounts);

  let currentCumulativeWeight = 0;
  const cumulativeWeights = availabilityCounts.map((availabilityCount) => {
    const weight = maxAvailability - availabilityCount + 1;
    currentCumulativeWeight += weight;
    return currentCumulativeWeight;
  });

  const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1]!;
  const randomWeight = Math.random() * maxCumulativeWeight;

  const selectedPlayer = playersForTrainingBlock.find((_player, index) => randomWeight < cumulativeWeights[index]!);
  if (!selectedPlayer) return null;

  const selectedPlayerIndex = availablePlayers.findIndex((availablePlayer) => availablePlayer.id === selectedPlayer.id);

  return { selectedPlayer, selectedPlayerIndex };
};
