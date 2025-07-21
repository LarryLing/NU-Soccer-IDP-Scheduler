import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  Availability,
  AvailabilitySheetForm,
  Days,
  Player,
  TrainingBlock,
  UserData,
} from "./types";
import { DAYS } from "./constants";
import supabase from "@/services/supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (hours === undefined || minutes === undefined) return 0;
  return hours * 60 + minutes;
};

export const formatTime = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

export const formatTimeWithPeriod = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, "0")}${hours >= 12 ? "PM" : "AM"}`;
};

export const transformAvailabilities = (availabilities: AvailabilitySheetForm[]) => {
  return availabilities
    .map((availability) => {
      return {
        ...availability,
        start_int: parseTime(availability.start),
        end_int: parseTime(availability.end),
      };
    })
    .sort((a, b) => a.start_int - b.start_int);
};

export const findOverlap = (availabilities: Availability[]) => {
  for (const day of DAYS) {
    const dayAvailabilities = availabilities.filter((availability) => availability.day === day);

    for (let i = 1; i < dayAvailabilities.length; i++) {
      const previous = dayAvailabilities[i - 1];
      const current = dayAvailabilities[i];

      if (!previous || !current) continue;

      if (previous.end_int > current.start_int) {
        return {
          day,
          previous,
          current,
        };
      }
    }
  }

  return null;
};

export const createAllTrainingBlocks = (
  userId: UserData["id"],
  availabilities: Availability[],
  trainingBlockDuration: number,
) => {
  const createdTrainingBlocks: TrainingBlock[] = [];
  for (const day of DAYS) {
    const dayAvailabilities = availabilities.filter((availability) => availability.day === day);

    for (let i = 0; i < dayAvailabilities.length; i++) {
      let currentInt = dayAvailabilities[i]?.start_int ?? 0;
      const endInt = dayAvailabilities[i]?.end_int ?? 0;

      while (currentInt < endInt) {
        const createdTrainingBlock: TrainingBlock = {
          id: crypto.randomUUID(),
          user_id: userId,
          day: day as Days,
          start: formatTime(currentInt),
          end: formatTime(currentInt + trainingBlockDuration),
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

const calculateCoefficientOfVariation = (counts: number[]) => {
  if (counts.length === 0) return 0;

  const mean = counts.reduce((sum, count) => sum + count, 0) / counts.length;
  if (mean === 0) return 0;

  const variance =
    counts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / counts.length;
  const standardDeviation = Math.sqrt(variance);

  return standardDeviation / mean;
};

const calculateMeanAbsoluteDeviation = (counts: number[], targetPlayerCount: number) => {
  if (counts.length === 0) return 0;

  return (
    counts.reduce((sum, count) => sum + Math.abs(count - targetPlayerCount), 0) / counts.length
  );
};

const calculateCombinedScore = (
  trainingBlockAssignedPlayerCounts: Record<string, number>,
  maximumPlayerCount: number,
  uniformityWeight: number = 0.2,
  targetAdherenceWeight: number = 0.8,
  debug = false,
) => {
  const counts = Object.values(trainingBlockAssignedPlayerCounts).filter((count) => count > 0);
  const targetPlayerCount = (maximumPlayerCount + 1) / 2;

  const cv = calculateCoefficientOfVariation(counts);
  const mad = calculateMeanAbsoluteDeviation(counts, targetPlayerCount);

  const uniformityScore = 1 / (1 + cv);
  const targetAdherenceScore = 1 / (1 + mad / targetPlayerCount);

  const uniformityContribution = uniformityWeight * uniformityScore;
  const targetAdherenceContribution = targetAdherenceWeight * targetAdherenceScore;

  const totalScore = uniformityContribution + targetAdherenceContribution;

  if (debug) {
    console.log(`
      === Score Breakdown ===
      Assigned Player Counts: ${Object.entries(trainingBlockAssignedPlayerCounts)}
      Counts: [${counts.join(", ")}]
      Target: ${targetPlayerCount}

      Raw Metrics:
      CV: ${cv.toFixed(4)}
      MAD: ${mad.toFixed(4)}

      Component Scores:
      Uniformity: ${uniformityScore.toFixed(4)} (range: 0-1)
      Target Adherence: ${targetAdherenceScore.toFixed(4)} (range: 0-1)

      Weighted Contributions:
      Uniformity: ${uniformityWeight} * ${uniformityScore.toFixed(4)} = ${uniformityContribution.toFixed(4)}
      Target: ${targetAdherenceWeight} * ${targetAdherenceScore.toFixed(4)} = ${targetAdherenceContribution.toFixed(4)}

      # Total Score: ${totalScore.toFixed(4)}
    `);
  }

  return totalScore;
};

export const assignPlayers = (
  players: Player[],
  trainingBlocks: TrainingBlock[],
  maximumPlayerCount: number,
) => {
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
    availableTrainingBlockIdsMap.set(
      player.id,
      getTrainingBlockIdsForPlayer(player, trainingBlocks),
    );
  });

  const allPlayers = [...players];
  while (allPlayers.length > 0) {
    const randomPlayerIndex = Math.floor(Math.random() * allPlayers.length);

    const player = allPlayers[randomPlayerIndex];
    if (!player) break;

    const availableBlockIds = availableTrainingBlockIdsMap.get(player.id) || [];
    if (availableBlockIds.length === 0) {
      allPlayers.splice(randomPlayerIndex, 1);
      continue;
    }

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
      allPlayers.splice(randomPlayerIndex, 1);
    }
  }

  const unassignedPlayerNames = players
    .filter((player) => playerAssignmentsMap.get(player.id) === null)
    .map((player) => player.name);

  const usedTrainingBlocks = trainingBlocks.filter(
    (trainingBlock) => trainingBlockAssignedPlayerCounts[trainingBlock.id] || 0 > 0,
  );

  return {
    unassignedPlayerNames,
    playerAssignmentsMap,
    usedTrainingBlocks,
  };
};

export const saveUsedTrainingBlocks = async (
  userId: UserData["id"],
  trainingBlocks: TrainingBlock[],
) => {
  const { error: deleteError } = await supabase
    .from("training_blocks")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    console.error("Error creating schedule", deleteError);
    throw deleteError;
  }

  const createTrainingBlockPromises = trainingBlocks.map((trainingBlock) =>
    supabase.from("training_blocks").insert(trainingBlock),
  );

  await Promise.all(createTrainingBlockPromises);
};

export const saveAssignedPlayers = async (
  playerAssignmentsMap: Map<Player["id"], TrainingBlock["id"] | null>,
) => {
  const assignPlayerPromises = [];
  for (const [playerId, trainingBlockId] of playerAssignmentsMap) {
    if (trainingBlockId === null) continue;
    assignPlayerPromises.push(
      supabase.from("players").update({ training_block_id: trainingBlockId }).eq("id", playerId),
    );
  }

  await Promise.all(assignPlayerPromises);
};

export const getDayAbbreviation = (day: Days) => {
  switch (day) {
    case "Monday":
      return "Mo";
    case "Tuesday":
      return "Tu";
    case "Wednesday":
      return "We";
    case "Thursday":
      return "Th";
    case "Friday":
      return "Fr";
  }
};
