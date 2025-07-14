import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Availability, AvailabilitySheetForm, Days, UserData } from "./types";
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

export const hasOverlaps = (availabilities: Availability[]) => {
  for (let i = 0; i < DAYS.length; i++) {
    const day = DAYS[i];
    const dayAvailabilities = availabilities.filter((availability) => availability.day === day);

    for (let j = 1; j < dayAvailabilities.length; j++) {
      const previous = dayAvailabilities[j - 1];
      const current = dayAvailabilities[j];

      if (previous && current && previous.end_int > current.start_int) {
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
  const createTrainingBlockPromises = [];

  for (let i = 0; i < DAYS.length; i++) {
    const day = DAYS[i];
    const dayAvailabilities = availabilities.filter((availability) => availability.day === day);

    for (let j = 0; j < dayAvailabilities.length; j++) {
      let currentInt = dayAvailabilities[j]?.start_int;
      const endInt = dayAvailabilities[j]?.end_int;

      if (currentInt === undefined || endInt === undefined) continue;

      while (currentInt < endInt) {
        createTrainingBlockPromises.push(
          supabase.from("training_blocks").insert({
            user_id: userId,
            day: day,
            start: formatTime(currentInt),
            end: formatTime(currentInt + trainingBlockDuration),
            start_int: currentInt,
            end_int: currentInt + trainingBlockDuration,
          }),
        );
        currentInt += trainingBlockDuration;
      }
    }
  }

  await supabase.from("training_blocks").delete().eq("user_id", userId);
  await Promise.all(createTrainingBlockPromises);
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
