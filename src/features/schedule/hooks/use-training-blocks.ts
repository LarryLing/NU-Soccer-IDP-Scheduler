import type { TrainingBlock } from "@/features/schedule/types/training-block.type";
import { useState } from "react";

export type UseTrainingBlocksReturn = {
  trainingBlocks: TrainingBlock[];
};

export const useTrainingBlocks = (): UseTrainingBlocksReturn => {
  const [trainingBlocks] = useState<TrainingBlock[]>([]);

  return { trainingBlocks };
};
