import type { SubmitHandler, UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import type { Database } from "../../database.types";
import type {
  ScheduleFormSchema,
  ForgotPasswordFormSchema,
  LoginFormSchema,
  PlayerFormSchema,
  ResetPasswordFormSchema,
  SignupFormSchema,
  AvailabilitySchema,
} from "./schemas";
import type z from "zod";

export type UserData = {
  id: string;
  email: string;
};

export type Player = Database["public"]["Tables"]["players"]["Row"];

export type PlayerMetadata = Pick<Player, "id" | "user_id" | "training_block_id">;

export type TrainingBlock = Database["public"]["Tables"]["training_blocks"]["Row"];

export type Availability = Pick<TrainingBlock, "day" | "start" | "start_int" | "end" | "end_int">;

export type Days = Database["public"]["Enums"]["days"];

export type Positions = Database["public"]["Enums"]["positions"];

export type LoginForm = z.infer<typeof LoginFormSchema>;
export type SignupForm = z.infer<typeof SignupFormSchema>;
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordFormSchema>;
export type ResetPasswordForm = z.infer<typeof ResetPasswordFormSchema>;
export type PlayerSheetForm = z.infer<typeof PlayerFormSchema>;
export type ScheduleSheetForm = z.infer<typeof ScheduleFormSchema>;
export type AvailabilitySheetForm = z.infer<typeof AvailabilitySchema>;

export type TrainingBlockDialogConfig = {
  day: Days;
  start: TrainingBlock["start"];
  end: TrainingBlock["end"];
  assignedPlayerNames: Player["name"][];
};

export type UsePlayersReturn = {
  players: Player[];
  insertPlayer: (player: Player) => Promise<void>;
  updatePlayer: (player: Player) => Promise<void>;
  deletePlayer: (playerId: string) => Promise<void>;
};

export type UsePlayersSheetReturn = {
  playerMetadata: PlayerMetadata | null;
  isPlayerSheetOpen: boolean;
  setIsPlayerSheetOpen: (isPlayerSheetOpen: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  form: UseFormReturn<PlayerSheetForm>;
  fieldArray: UseFieldArrayReturn<PlayerSheetForm, "availabilities", "id">;
  openPlayerSheet: (playerId: string | null) => void;
  addAvailability: (day: Days) => void;
  onSubmit: SubmitHandler<PlayerSheetForm>;
};

export type UseScheduleSheetReturn = {
  isScheduleSheetOpen: boolean;
  setIsScheduleSheetOpen: (isScheduleSheetOpen: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  trainingBlocks: TrainingBlock[];
  isLoading: boolean;
  form: UseFormReturn<ScheduleSheetForm>;
  fieldArray: UseFieldArrayReturn<ScheduleSheetForm, "fieldAvailabilities", "id">;
  openScheduleSheet: () => void;
  addFieldAvailability: (day: Days) => void;
  onSubmit: SubmitHandler<ScheduleSheetForm>;
};

export type AuthContextType = {
  user: UserData | null;
  isLoading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
};
