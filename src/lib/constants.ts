import type { PlayerSheetForm, ScheduleSheetForm } from "./types.ts";

export const DEFAULT_PLAYER: PlayerSheetForm = {
  name: "",
  number: 0,
  position: "Goalkeeper",
  availabilities: [],
} as const;

export const DEFAULT_SCHEDULE: ScheduleSheetForm = {
  duration: 30,
  maximumPlayerCount: 4,
  fieldAvailabilities: [],
} as const;

export const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"] as const;

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export const TIMES = {
  "8 AM": 480,
  "9 AM": 540,
  "10 AM": 600,
  "11 AM": 660,
  "12 PM": 720,
  "1 PM": 780,
  "2 PM": 840,
  "3 PM": 900,
  "4 PM": 960,
  "5 PM": 1020,
};
