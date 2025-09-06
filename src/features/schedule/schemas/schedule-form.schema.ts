import { z } from "zod";

import { AvailabilityFormSchema } from "@/schemas/availability-form.schema";

export const ScheduleFormSchema = z.object({
  duration: z.coerce
    .number({ message: "Duration is required" })
    .min(15, {
      message: "Duration must be greater than or equal to 15 minutes.",
    })
    .max(60, {
      message: "Number must be less than or equal to 60 minutes.",
    }),
  maximumPlayerCount: z.coerce
    .number({ message: "Maximum number of players is required" })
    .min(1, {
      message: "Maximum number of players must be greater than or equal to 1.",
    })
    .max(4, {
      message: "Maximum number of players must be less than or equal to 4 minutes.",
    }),
  fieldAvailabilities: z.array(AvailabilityFormSchema),
});

export type ScheduleForm = z.infer<typeof ScheduleFormSchema>;
