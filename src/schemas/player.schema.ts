import z from "zod";

import { POSITIONS } from "@/features/players/constants/positions";

import { AvailabilitySchema } from "./availability.schema";

export const PlayerSchema = z.object({
  id: z.string().uuid(),
  trainingBlockId: z.string().nullable(),
  name: z.string(),
  number: z.number().min(0).max(99),
  position: z.enum(POSITIONS),
  availabilities: z.array(AvailabilitySchema),
});

export type Player = z.infer<typeof PlayerSchema>;
