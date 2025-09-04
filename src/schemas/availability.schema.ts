import { z } from "zod";

import { calculateMinutesFromTimeString } from "@/lib/time";

export const AvailabilitySchema = z
  .object({
    day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
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
      message: "End time must be after start time.",
      path: ["end"],
    }
  );

export type AvailabilityFormType = z.infer<typeof AvailabilitySchema>;
