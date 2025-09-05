import { DAYS } from "@/constants/days";
import type { AvailabilityFormType } from "@/schemas/availability.schema";
import type { Availability } from "@/types/availability.type";

import { calculateMinutesFromTimeString } from "./time";

export const transformAndSortAvailabilities = (availabilities: AvailabilityFormType[]) => {
  return availabilities
    .map((availability) => {
      return {
        ...availability,
        start_int: calculateMinutesFromTimeString(availability.start),
        end_int: calculateMinutesFromTimeString(availability.end),
      };
    })
    .sort((a, b) => a.start_int - b.start_int);
};

export const findOverlapInAvailabilities = (availabilities: Availability[]) => {
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
