import { DAYS } from "@/constants/days";
import type { AvailabilityForm } from "@/schemas/availability-form.schema";
import type { Availability } from "@/schemas/availability.schema";

import { calculateMinutesFromTimeString, getTimeStringWithoutMeridian } from "./time";

export const transformIntoAvailabilityArray = (availabilities: AvailabilityForm[]): Availability[] => {
  return availabilities
    .map((availability) => {
      return {
        day: availability.day,
        start: calculateMinutesFromTimeString(availability.start),
        end: calculateMinutesFromTimeString(availability.end),
      };
    })
    .sort((a, b) => a.start - b.start);
};

export const transformIntoAvailabilityFormArray = (availabilities: Availability[]): AvailabilityForm[] => {
  return availabilities.map((availability) => {
    return {
      day: availability.day,
      start: getTimeStringWithoutMeridian(availability.start),
      end: getTimeStringWithoutMeridian(availability.end),
    };
  });
};

export const findOverlapInAvailabilities = (availabilities: Availability[]) => {
  for (const day of DAYS) {
    const dayAvailabilities = availabilities.filter((availability) => availability.day === day);

    for (let i = 1; i < dayAvailabilities.length; i++) {
      const previous = dayAvailabilities[i - 1];
      const current = dayAvailabilities[i];

      if (!previous || !current) continue;

      if (previous.end > current.start) {
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
