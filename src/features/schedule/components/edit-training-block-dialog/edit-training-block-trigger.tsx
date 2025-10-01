import { memo } from "react";

import { Button } from "@/components/ui/button";
import { usePlayers } from "@/features/players/hooks/use-players-store";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { isPlayerAvailableForTrainingBlock } from "../../lib/schedule";

type EditTrainingBlockTriggerProps = {
  currentCellStartInt: number;
  openTrainingBlockDialog: (trainingBlockId: TrainingBlock["id"]) => void;
} & Pick<TrainingBlock, "id" | "day" | "start" | "end">;

const EditTrainingBlockTrigger = ({
  currentCellStartInt,
  openTrainingBlockDialog,
  id,
  day,
  start,
  end,
}: EditTrainingBlockTriggerProps) => {
  const players = usePlayers();

  const assignedPlayers = players.filter((player) => player.trainingBlockId === id);

  const handleOpenTrainingBlockDialog = () => {
    openTrainingBlockDialog(id);
  };

  const topPercentage = ((start - currentCellStartInt) / 60) * 100;
  const heightPercentage = ((end - start) / 60) * 100;

  const assignedPlayerNames = assignedPlayers.map((assignedPlayer) => assignedPlayer.name);
  const hasUnavailablePlayers = assignedPlayers.some(
    (player) => !isPlayerAvailableForTrainingBlock(player, { id, day, start, end })
  );

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
      <p
        className={`text-xs text-wrap truncate ${hasUnavailablePlayers ? "text-yellow-700 dark:text-yellow-300" : ""}`}
      >
        {assignedPlayerNames.join(" • ")}
      </p>
    </Button>
  );
};

export default memo(EditTrainingBlockTrigger);
