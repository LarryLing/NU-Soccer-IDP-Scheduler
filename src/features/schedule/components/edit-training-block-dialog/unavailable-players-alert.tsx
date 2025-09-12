import { AlertTriangleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import type { UseEditTrainingBlockDialogReturn } from "../../hooks/use-edit-training-block-dialog";
import { isPlayerAvailableForTrainingBlock } from "../../lib/schedule";

type UnavailablePlayersAlertProps = Pick<UseEditTrainingBlockDialogReturn, "selectedTrainingBlock" | "assignedPlayers">;

const UnavailablePlayersAlert = ({ selectedTrainingBlock, assignedPlayers }: UnavailablePlayersAlertProps) => {
  if (!selectedTrainingBlock) return null;

  const unavailablePlayerNames = assignedPlayers
    .filter((assignedPlayer) => !isPlayerAvailableForTrainingBlock(assignedPlayer, selectedTrainingBlock))
    .map((assignedPlayer) => assignedPlayer.name);

  if (unavailablePlayerNames.length === 0) return null;

  return (
    <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400">
      <AlertTriangleIcon />
      <AlertTitle>This training block contains unavailable players</AlertTitle>
      <AlertDescription className="text-yellow-700 dark:text-yellow-300">
        {unavailablePlayerNames.join(" • ")}
      </AlertDescription>
    </Alert>
  );
};

export default UnavailablePlayersAlert;
