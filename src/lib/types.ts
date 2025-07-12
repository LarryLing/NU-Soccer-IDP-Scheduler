import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import type { Database } from "../../database.types";
import type {
  ForgotPasswordFormSchema,
  LoginFormSchema,
  PlayerFormSchema,
  ResetPasswordFormSchema,
  SignupFormSchema,
} from "./schemas";
import type z from "zod";

export type UserData = {
  id: string;
  email: string;
};

export type Player = Database["public"]["Tables"]["players"]["Row"];

export type PlayerMetadata = Pick<
  Player,
  "id" | "user_id" | "training_block_id"
>;

export type TrainingBlock =
  Database["public"]["Tables"]["training_blocks"]["Row"];

export type Availability = Pick<
  TrainingBlock,
  "day" | "start" | "start_int" | "end" | "end_int"
>;

export type Days = Database["public"]["Enums"]["days"];

export type Positions = Database["public"]["Enums"]["positions"];

export type LoginForm = z.infer<typeof LoginFormSchema>;
export type SignupForm = z.infer<typeof SignupFormSchema>;
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordFormSchema>;
export type ResetPasswordForm = z.infer<typeof ResetPasswordFormSchema>;
export type PlayerSheetForm = z.infer<typeof PlayerFormSchema>;

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
};

export type UseScheduleSheetReturn = {
  isScheduleSheetOpen: boolean;
  setIsScheduleSheetOpen: (isScheduleSheetOpen: boolean) => void;
  isSchedulingPlayers: boolean;
  setIsSchedulingPlayers: (isSchedulingPlayers: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  openScheduleSheet: () => void;
  addFieldAvailability: () => void;
  schedulePlayers: () => void;
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
