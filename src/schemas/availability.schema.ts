import z from "zod";

import { DAYS } from "@/constants/days";

export const AvailabilitySchema = z.object({
  day: z.enum(DAYS, {
    message: "Missing or invalid training block day",
  }),
  start: z
    .number({ message: "Missing or invalid start time" })
    .min(0, {
      message: "Start time must be greater than or equal to 0",
    })
    .max(1439, {
      message: "Start time must be less than or equal to 1439",
    }),
  end: z
    .number({ message: "Missing or invalid end time" })
    .min(0, {
      message: "End time must be greater than or equal to 0",
    })
    .max(1439, {
      message: "End time must be less than or equal to 1439",
    }),
});

export type Availability = z.infer<typeof AvailabilitySchema>;
