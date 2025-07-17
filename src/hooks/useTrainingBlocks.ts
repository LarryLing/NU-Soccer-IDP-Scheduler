import { useAuth } from "@/hooks/useAuth";
import type { Days, TrainingBlock } from "@/lib/types";
import supabase from "@/services/supabase";
import { useState, useEffect } from "react";

export const useTrainingBlocks = (day: Days) => {
  const { user } = useAuth();

  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);

  useEffect(() => {
    const fetchTrainingBlocks = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("training_blocks")
        .select("*")
        .eq("user_id", user.id)
        .eq("day", day);

      if (error || !data) {
        console.error(`Error fetching training blocks for ${day}`, error);
        return;
      }

      setTrainingBlocks(data);
    };

    fetchTrainingBlocks();
  }, []);

  return { trainingBlocks };
};
