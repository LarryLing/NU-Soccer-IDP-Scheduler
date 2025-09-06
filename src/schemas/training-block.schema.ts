import z from "zod";

import { DAYS } from "@/constants/days";

export const TrainingBlockSchema = z.object({
  id: z.string().uuid(),
  day: z.enum(DAYS),
  start: z.number().min(0).max(1439),
  end: z.number().min(0).max(1439),
});

export type TrainingBlock = z.infer<typeof TrainingBlockSchema>;
