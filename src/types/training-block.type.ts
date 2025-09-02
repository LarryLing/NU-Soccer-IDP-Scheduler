import type { Day } from "@/constants/days";

export type TrainingBlock = {
  id: string;
  day: Day;
  start: string;
  start_int: number;
  end: string;
  end_int: number;
};
