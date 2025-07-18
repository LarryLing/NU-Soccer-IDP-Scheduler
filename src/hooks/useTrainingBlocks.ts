import { useAuth } from "@/hooks/useAuth";
import type { TrainingBlock } from "@/lib/types";
import supabase from "@/services/supabase";
import { useState, useEffect } from "react";

export const useTrainingBlocks = () => {
  const { user } = useAuth();

  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);

  useEffect(() => {
    const fetchTrainingBlocks = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("training_blocks")
        .select("*")
        .eq("user_id", user.id);

      if (error || !data) {
        console.error(`Error fetching training blocks`, error);
        return;
      }

      setTrainingBlocks(data);
    };

    fetchTrainingBlocks();
  }, []);

  return { trainingBlocks, setTrainingBlocks };
};
