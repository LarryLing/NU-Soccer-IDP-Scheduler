import type { Database } from "../../database.types";

export type UserData = {
  id: string;
  email: string;
};

export type Player = Database["public"]["Tables"]["players"]["Row"];

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
