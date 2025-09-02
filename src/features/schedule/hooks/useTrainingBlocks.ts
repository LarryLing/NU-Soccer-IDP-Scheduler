import type { Day, TrainingBlock } from "@/lib/types";
import { useState, useEffect } from "react";

export type UseTrainingBlocksReturn = {
  trainingBlocks: TrainingBlock[];
};

export const useTrainingBlocks = (day: Day): UseTrainingBlocksReturn => {
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);

  useEffect(() => {
    const fetchTrainingBlocks = async () => {
      const { data: trainingBlocks, error } = await supabase.from("training_blocks").select("*").eq("day", day);

      if (error || !trainingBlocks) {
        console.error(`Error fetching training blocks`, error);
        return;
      }

      setTrainingBlocks(trainingBlocks);
    };

    fetchTrainingBlocks();
  }, [day]);

  return { trainingBlocks };
};
