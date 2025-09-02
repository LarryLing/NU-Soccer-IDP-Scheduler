import type { ScheduleFormType } from "../schemas/schedule.schema";

export const DEFAULT_SCHEDULE: ScheduleFormType = {
  duration: 30,
  maximumPlayerCount: 4,
  fieldAvailabilities: [],
} as const;
