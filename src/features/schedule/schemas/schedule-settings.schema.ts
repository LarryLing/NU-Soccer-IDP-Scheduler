import { z } from "zod";

import { AvailabilitySchema } from "@/schemas/availability.schema";

export const ScheduleSettingsSchema = z.object({
  duration: z.coerce
    .number({ message: "Duration is required" })
    .min(15, {
      message: "Duration must be greater than or equal to 15 minutes",
    })
    .max(60, {
      message: "Duration must be less than or equal to 60 minutes",
    }),
  targetPlayerCount: z.coerce
    .number({ message: "Maximum number of players is required" })
    .min(1, {
      message: "Maximum number of players must be greater than or equal to 1",
    })
    .max(5, {
      message: "Maximum number of players must be less than or equal to 5",
    })
    .default(4),
  availabilities: z.array(AvailabilitySchema),
});

export type ScheduleSettings = z.infer<typeof ScheduleSettingsSchema>;
