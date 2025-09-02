import { GOALKEEPER } from "@/constants/positions";
import type { PlayerFormType } from "../schemas/player.schema";

export const DEFAULT_PLAYER: PlayerFormType = {
  name: "",
  number: 0,
  position: GOALKEEPER,
  availabilities: [],
} as const;
