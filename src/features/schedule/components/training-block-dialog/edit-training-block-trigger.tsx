import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import usePlayersStore from "@/features/players/hooks/use-players-store";
import { getTimeStringWithMeridian } from "@/lib/time";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { isPlayerAvailableForTrainingBlock } from "../../lib/schedule";

type EditTrainingBlockTriggerProps = {
  currentCellStartInt: number;
  openTrainingBlockDialog: (trainingBlockId: TrainingBlock["id"]) => void;
} & Pick<TrainingBlock, "id" | "day" | "start" | "end" | "assignedPlayerCount">;

const EditTrainingBlockTrigger = ({
  currentCellStartInt,
  openTrainingBlockDialog,
  id,
  day,
  start,
  end,
  assignedPlayerCount,
}: EditTrainingBlockTriggerProps) => {
  const players = usePlayersStore((state) => state.players);

  if (assignedPlayerCount === 0) return null;

  const handleOpenTrainingBlockDialog = () => {
    openTrainingBlockDialog(id);
  };

  const topPercentage = ((start - currentCellStartInt) / 60) * 100;
  const heightPercentage = ((end - start) / 60) * 100;

  const hasUnavailablePlayers = players
    .filter((player) => player.trainingBlockId === id)
    .some((player) => !isPlayerAvailableForTrainingBlock(player.id, id));

  return (
    <Button
      variant="outline"
      className={`absolute border overflow-hidden flex items-center px-3 ${hasUnavailablePlayers ? "border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400" : ""}`}
      style={{
        width: `calc(100% - 2px)`,
        top: `${topPercentage}%`,
        height: `calc(${heightPercentage}% - 2px)`,
      }}
      onClick={handleOpenTrainingBlockDialog}
    >
      {hasUnavailablePlayers && <AlertTriangleIcon />}
      <p className={`text-nowrap truncate ${hasUnavailablePlayers ? "text-yellow-700 dark:text-yellow-300" : ""}`}>
        {day} • {getTimeStringWithMeridian(start)} - {getTimeStringWithMeridian(end)}
      </p>
    </Button>
  );
};

export default EditTrainingBlockTrigger;
