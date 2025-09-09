import { AlertTriangleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Player } from "@/schemas/player.schema";

type UnavailablePlayersAlertProps = {
  unavailablePlayerNames: Player["name"][];
};

const UnavailablePlayersAlert = ({ unavailablePlayerNames }: UnavailablePlayersAlertProps) => {
  if (unavailablePlayerNames.length === 0) return null;

  return (
    <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400">
      <AlertTriangleIcon />
      <AlertTitle>This training block contains unavailable players</AlertTitle>
      <AlertDescription className="text-yellow-700 dark:text-yellow-300">
        {unavailablePlayerNames.join(", ")}
      </AlertDescription>
    </Alert>
  );
};

export default UnavailablePlayersAlert;
