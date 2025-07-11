import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import type { Database } from "../../database.types";
import type { PlayerFormSchema } from "./schemas";
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

export type AuthContextType = {
  user: UserData | null;
  isLoading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
};

export type PlayersContextType = {
  players: Player[];
  insertPlayer: (player: Player) => Promise<void>;
  updatePlayer: (player: Player) => Promise<void>;
  deletePlayer: (playerId: string) => Promise<void>;
};

export type PlayerSheetFormSchemaType = z.infer<typeof PlayerFormSchema>;

export type PlayerSheetContextType = {
  playerMetadata: PlayerMetadata | null;
  isPlayerSheetOpen: boolean;
  setIsPlayerSheetOpen: (isPlayerSheetOpen: boolean) => void;
  form: UseFormReturn<PlayerSheetFormSchemaType>;
  fieldArray: UseFieldArrayReturn<
    PlayerSheetFormSchemaType,
    "availabilities",
    "id"
  >;
  openPlayerSheet: (playerId: string | null) => void;
  addAvailability: (day: Days) => void;
};
