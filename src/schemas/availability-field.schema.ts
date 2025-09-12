import { z } from "zod";

import { DAYS } from "@/constants/days";
import { calculateMinutesFromTimeString } from "@/lib/time";

export const AvailabilityFieldSchema = z
  .object({
    day: z.enum(DAYS),
    start: z.string().min(1, {
      message: "Start time is required",
    }),
    end: z.string().min(1, {
      message: "End time is required",
    }),
  })
  .refine(
    (data) => {
      return calculateMinutesFromTimeString(data.end) > calculateMinutesFromTimeString(data.start);
    },
    {
      message: "End time must be after start time",
      path: ["end"],
    }
  );

export type AvailabilityField = z.infer<typeof AvailabilityFieldSchema>;
