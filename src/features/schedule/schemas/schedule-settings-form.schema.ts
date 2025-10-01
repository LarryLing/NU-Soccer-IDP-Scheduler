import { z } from "zod";

import { AvailabilityFieldSchema } from "@/schemas/availability-field.schema";

export const ScheduleSettingsFormSchema = z.object({
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
    }),
  availabilities: z.array(AvailabilityFieldSchema),
});

export type ScheduleSettingsForm = z.infer<typeof ScheduleSettingsFormSchema>;
