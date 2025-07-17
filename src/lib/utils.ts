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
  for (const day in DAYS) {
    const dayAvailabilities = availabilities.filter((availability) => availability.day === day);

    for (let j = 1; j < dayAvailabilities.length; j++) {
      const previous = dayAvailabilities[j - 1];
      const current = dayAvailabilities[j];

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

  for (const day in DAYS) {
    const dayAvailabilities = availabilities.filter((availability) => availability.day === day);

    for (let j = 0; j < dayAvailabilities.length; j++) {
      let currentInt = dayAvailabilities[j]?.start_int;
      const endInt = dayAvailabilities[j]?.end_int;

      if (currentInt === undefined || endInt === undefined) continue;

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
    console.log("Error creating schedule", deleteError);
    throw deleteError;
  }

  await Promise.all(createTrainingBlockPromises);

  return createdTrainingBlocks;
};

export const assignPlayers = async (players: Player[], trainingBlocks: TrainingBlock[]) => {
  console.log(players);
  console.log(trainingBlocks);
  throw new Error("Not implemented");
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
