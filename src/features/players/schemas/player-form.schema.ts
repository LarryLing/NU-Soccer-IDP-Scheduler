import { z } from "zod";

import { POSITIONS } from "@/features/players/constants/positions";
import { AvailabilitySchema } from "@/schemas/availability.schema";

export const PlayerFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .regex(/^[A-Za-z]+(?:[ '-.][A-Za-z]+)*$/, {
      message: "Name cannot contain special characters.",
    }),
  number: z.coerce
    .number({ message: "Number is required" })
    .min(0, {
      message: "Number must be greater than or equal to 0.",
    })
    .max(99, {
      message: "Number must be less than or equal to 99.",
    }),
  position: z.enum(POSITIONS),
  availabilities: z.array(AvailabilitySchema),
});

export type PlayerFormType = z.infer<typeof PlayerFormSchema>;
