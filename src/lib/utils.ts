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

const calculateBalanceScore = (trainingBlockAssignedPlayerCounts: Record<string, number>) => {
  const counts = Object.values(trainingBlockAssignedPlayerCounts);
  if (counts.length === 0) return 0;

  const mean = counts.reduce((sum, count) => sum + count, 0) / counts.length;
  const variance =
    counts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / counts.length;

  return Math.sqrt(variance);
};

const calculateEfficiencyScore = (trainingBlockAssignedPlayerCounts: Record<string, number>) => {
  const counts = Object.values(trainingBlockAssignedPlayerCounts);
  if (counts.length === 0) return 0;

  const totalPlayers = counts.reduce((sum, count) => sum + count, 0);
  const usedBlocks = counts.filter((count) => count > 0).length;

  if (usedBlocks === 0) return 0;

  // Count blocks with only 1 player (inefficient)
  const singlePlayerBlocks = counts.filter((count) => count === 1).length;

  // Calculate efficiency penalty
  // Higher penalty for more single-player blocks
  const singlePlayerPenalty = singlePlayerBlocks * 10;

  // Calculate block utilization (prefer fewer blocks with more players)
  const avgPlayersPerUsedBlock = totalPlayers / usedBlocks;
  const utilizationPenalty = usedBlocks / Math.max(avgPlayersPerUsedBlock, 1);

  return singlePlayerPenalty + utilizationPenalty;
};

const calculateCombinedScore = (
  trainingBlockAssignedPlayerCounts: Record<string, number>,
  currentBlockCount: number,
  balanceWeight: number = 1.0,
  efficiencyWeight: number = 0.5,
  currentCountWeight: number = 1000,
) => {
  const balanceScore = calculateBalanceScore(trainingBlockAssignedPlayerCounts);
  const efficiencyScore = calculateEfficiencyScore(trainingBlockAssignedPlayerCounts);

  // Prefer blocks with lower current count (primary factor)
  // Add balance and efficiency as secondary factors
  return (
    currentBlockCount * currentCountWeight +
    balanceScore * balanceWeight +
    efficiencyScore * efficiencyWeight
  );
};

export const assignPlayers = (players: Player[], trainingBlocks: TrainingBlock[]) => {
  const playerAssignmentsMap = new Map<Player["id"], TrainingBlock["id"] | null>();
  players.forEach((player) => {
    playerAssignmentsMap.set(player.id, null);
  });

  // Initialize block counts
  const trainingBlockAssignedPlayerCounts: Record<TrainingBlock["id"], number> = {};
  trainingBlocks.forEach((block) => {
    trainingBlockAssignedPlayerCounts[block.id] = 0;
  });

  // Create a map of player to available blocks for efficiency
  const playerToAvailableBlockIds = new Map<Player["id"], TrainingBlock["id"][]>();
  players.forEach((player) => {
    playerToAvailableBlockIds.set(player.id, getTrainingBlockIdsForPlayer(player, trainingBlocks));
  });

  // Sort players by number of available blocks (ascending)
  // This ensures players with fewer options get priority
  const sortedPlayers = [...players].sort((a, b) => {
    const aBlocks = playerToAvailableBlockIds.get(a.id)?.length || 0;
    const bBlocks = playerToAvailableBlockIds.get(b.id)?.length || 0;
    return aBlocks - bBlocks;
  });

  // Assign players to blocks
  for (const player of sortedPlayers) {
    const availableBlockIds = playerToAvailableBlockIds.get(player.id) || [];
    if (availableBlockIds.length === 0) continue;

    // Find the best block for this player
    // Prefer blocks with fewer players to maintain balance
    let bestBlockId: TrainingBlock["id"] | null = null;
    let bestScore = Infinity;

    for (const blockId of availableBlockIds) {
      const currentCount = trainingBlockAssignedPlayerCounts[blockId] || 0;

      // Create a temporary assignment to test the balance
      const tempCounts = { ...trainingBlockAssignedPlayerCounts };
      tempCounts[blockId] = currentCount + 1;

      const score = calculateCombinedScore(tempCounts, currentCount);

      if (score < bestScore) {
        bestScore = score;
        bestBlockId = blockId;
      }
    }

    // Assign the player to the best block
    if (bestBlockId) {
      console.log(`placing ${player.id} in ${bestBlockId}`);
      playerAssignmentsMap.set(player.id, bestBlockId);
      trainingBlockAssignedPlayerCounts[bestBlockId]!++;
    }
  }

  // Find unassigned players
  const unassignedPlayerNames = players
    .filter((player) => playerAssignmentsMap.get(player.id) === null)
    .map((player) => player.name);

  // Find used training blocks
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
