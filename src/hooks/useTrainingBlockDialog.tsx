import type {
  Days,
  Player,
  TrainingBlock,
  TrainingBlockDialogConfig,
  UseTrainingBlockDialogReturn,
} from "@/lib/types";
import { formatTimeWithPeriod } from "@/lib/utils";
import { useCallback, useState } from "react";

export const useTrainingBlockDialog = (): UseTrainingBlockDialogReturn => {
  const [dialogConfig, setDialogConfig] = useState<TrainingBlockDialogConfig | null>(null);
  const [isTrainingBlockDialogOpen, setIsTrainingBlockDialogOpen] = useState(false);

  const openTrainingBlockDialog = useCallback(
    (
      day: Days,
      start_int: TrainingBlock["start_int"],
      end_int: TrainingBlock["end_int"],
      assignedPlayerNames: Player["name"][],
    ) => {
      setDialogConfig({
        day: day,
        start: formatTimeWithPeriod(start_int),
        end: formatTimeWithPeriod(end_int),
        assignedPlayerNames: assignedPlayerNames,
      });
      setIsTrainingBlockDialogOpen(true);
    },
    [],
  );

  return {
    dialogConfig,
    isTrainingBlockDialogOpen,
    setIsTrainingBlockDialogOpen,
    openTrainingBlockDialog,
  };
};
