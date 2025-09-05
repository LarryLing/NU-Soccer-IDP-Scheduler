import type { Position } from "@/features/players/constants/positions";

import type { Availability } from "./availability.type";

export type Player = {
  id: string;
  training_block_id: string | null;
  name: string;
  number: number;
  position: Position;
  availabilities: Availability[];
};
