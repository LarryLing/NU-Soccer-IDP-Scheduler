import type { Day } from "@/constants/days";

export type TrainingBlock = {
  id: string;
  day: Day;
  start_int: number;
  end_int: number;
};
