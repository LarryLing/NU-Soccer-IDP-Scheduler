import type { Day } from "@/constants/days";

export type Availability = {
  day: Day;
  start: string;
  start_int: number;
  end: string;
  end_int: number;
};
