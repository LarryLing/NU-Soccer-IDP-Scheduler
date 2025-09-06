import type { Day } from "@/constants/days";

export type Availability = {
  day: Day;
  start: number;
  end: number;
};
