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

export const createTrainingBlocks = async (
  userId: UserData["id"],
  availabilities: Availability[],
  trainingBlockDuration: number,
) => {
  const createdTrainingBlocks: TrainingBlock[] = [];
  const createTrainingBlockPromises = [];

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

        createTrainingBlockPromises.push(
          supabase.from("training_blocks").insert(createdTrainingBlock),
        );

        currentInt += trainingBlockDuration;
      }
    }
  }

  const { error: deleteError } = await supabase
    .from("training_blocks")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    console.error("Error creating schedule", deleteError);
    throw deleteError;
  }

  await Promise.all(createTrainingBlockPromises);

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

const getAssignedTrainingBlockId = (
  assignedPlayersMap: Map<TrainingBlock["id"], Player["id"][]>,
  trainingBlockIds: TrainingBlock["id"][],
): TrainingBlock["id"] => {
  const trainingBlockIdOptions = [];

  const trainingBlockIdsWithNoAssignedPlayers = trainingBlockIds.filter(
    (trainingBlockId) => (assignedPlayersMap.get(trainingBlockId) ?? []).length === 0,
  );
  let randomIndex = Math.floor(Math.random() * trainingBlockIdsWithNoAssignedPlayers.length);
  trainingBlockIdOptions.push(trainingBlockIdsWithNoAssignedPlayers[randomIndex] ?? "");

  const trainingBlockIdsWithAssignedPlayers = trainingBlockIds.filter(
    (trainingBlockId) => (assignedPlayersMap.get(trainingBlockId) ?? []).length !== 0,
  );

  trainingBlockIdsWithAssignedPlayers.forEach((trainingBlockIdWithAssignedPlayers) => {
    const numAssignedPlayers = (assignedPlayersMap.get(trainingBlockIdWithAssignedPlayers) ?? [])
      .length;
    for (let i = 0; i < numAssignedPlayers * 2; i++) {
      trainingBlockIdOptions.push(trainingBlockIdWithAssignedPlayers);
    }
  });

  randomIndex = Math.floor(Math.random() * trainingBlockIdOptions.length);
  return trainingBlockIdOptions[randomIndex] ?? "";
};

export const assignPlayers = async (
  players: Player[],
  trainingBlocks: TrainingBlock[],
  maximumPlayerCount: number,
) => {
  const assignedPlayersMap = new Map<TrainingBlock["id"], Player["id"][]>();
  trainingBlocks.forEach((trainingBlock) => {
    assignedPlayersMap.set(trainingBlock.id, []);
  });

  const availableTrainingBlockIdsMap = new Map<Player["id"], TrainingBlock["id"][]>();
  players.forEach((player) => {
    availableTrainingBlockIdsMap.set(
      player.id,
      getTrainingBlockIdsForPlayer(player, trainingBlocks),
    );
  });

  const assignPlayerPromises = [];

  const unassignedPlayers = [...players].filter(
    (unassignedPlayer) => (availableTrainingBlockIdsMap.get(unassignedPlayer.id) ?? []).length > 0,
  );

  while (unassignedPlayers.length > 0) {
    const randomPlayerIndex = Math.floor(Math.random() * unassignedPlayers.length);
    const player = unassignedPlayers[randomPlayerIndex];
    if (!player) break;

    const availableTrainingBlocksIds = availableTrainingBlockIdsMap.get(player.id) ?? [];
    if (availableTrainingBlocksIds.length === 0) break;

    const filteredAvailableTrainingBlockIds = availableTrainingBlocksIds.filter(
      (availableTrainingBlockId) => {
        const assignedPlayers = assignedPlayersMap.get(availableTrainingBlockId) ?? [];
        return assignedPlayers.length < maximumPlayerCount;
      },
    );

    const assignedTrainingBlockId = getAssignedTrainingBlockId(
      assignedPlayersMap,
      filteredAvailableTrainingBlockIds,
    );

    assignPlayerPromises.push(
      supabase
        .from("players")
        .update({ training_block_id: assignedTrainingBlockId })
        .eq("id", player.id),
    );

    unassignedPlayers.splice(randomPlayerIndex, 1);
    assignedPlayersMap.get(assignedTrainingBlockId)?.push(player.id);
  }

  await Promise.all(assignPlayerPromises);

  return unassignedPlayers.map((unassignedPlayer) => unassignedPlayer.name);
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
