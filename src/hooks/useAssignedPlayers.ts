import type { Player, TrainingBlock } from "@/lib/types";
import supabase from "@/services/supabase";
import { useEffect, useState } from "react";

export const useAssignedPlayers = (trainingBlockId: TrainingBlock["id"]) => {
  const [assignedPlayerNames, setAssignedPlayerNames] = useState<Player["name"][]>([]);

  useEffect(() => {
    const fetchAssignedPlayers = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("name")
        .eq("training_block_id", trainingBlockId);
      if (error || !data) {
        console.error("Error fetching assigned players", error);
        return;
      }

      setAssignedPlayerNames(data.map((datum) => datum.name));
    };

    fetchAssignedPlayers();
  }, []);

  return { assignedPlayerNames };
};
