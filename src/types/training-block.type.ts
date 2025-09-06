import type { Day } from "@/constants/days";

export type TrainingBlock = {
  id: string;
  day: Day;
  start: number;
  end: number;
};
