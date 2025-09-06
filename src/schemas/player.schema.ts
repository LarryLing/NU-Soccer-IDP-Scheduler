import z from "zod";

import { POSITIONS } from "@/features/players/constants/positions";

import { AvailabilitySchema } from "./availability.schema";

export const PlayerSchema = z.object({
  id: z.string({ message: "Missing player ID" }).uuid({ message: "Invalid player ID" }),
  trainingBlockId: z.string({ message: "Missing or invalid training block ID" }).nullable(),
  name: z.string({ message: "Missing or invalid player name" }),
  number: z
    .number({ message: "Missing or invalid player number" })
    .min(0, {
      message: "Player number must be greater than or equal to 0",
    })
    .max(99, {
      message: "Player number must be less than or equal to 99",
    }),
  position: z.enum(POSITIONS, {
    message: "Missing or invalid player position",
  }),
  availabilities: z.array(AvailabilitySchema),
});

export type Player = z.infer<typeof PlayerSchema>;
