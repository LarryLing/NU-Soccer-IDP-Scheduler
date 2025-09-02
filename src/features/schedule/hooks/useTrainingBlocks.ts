import type { TrainingBlock } from "@/types/training-block.type";
import { useState } from "react";

export type UseTrainingBlocksReturn = {
  trainingBlocks: TrainingBlock[];
};

export const useTrainingBlocks = (): UseTrainingBlocksReturn => {
  const [trainingBlocks] = useState<TrainingBlock[]>([]);

  return { trainingBlocks };
};
