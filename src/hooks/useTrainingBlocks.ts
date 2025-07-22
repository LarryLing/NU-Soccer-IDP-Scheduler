import type { Days, TrainingBlock } from "@/lib/types";
import supabase from "@/services/supabase";
import { useState, useEffect } from "react";

export const useTrainingBlocks = (day: Days) => {
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);

  useEffect(() => {
    const fetchTrainingBlocks = async () => {
      const { data: trainingBlocks, error } = await supabase
        .from("training_blocks")
        .select("*")
        .eq("day", day);

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
