import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { isPlayerAvailableForTrainingBlock } from "../../lib/schedule";

type TrainingBlockDialogSearchItemProps = { selectedTrainingBlockId: TrainingBlock["id"] } & Pick<
  Player,
  "id" | "trainingBlockId" | "name" | "number" | "position"
>;

const TrainingBlockDialogSearchItem = ({
  selectedTrainingBlockId,
  id: playerId,
  trainingBlockId,
  name,
  number,
  position,
}: TrainingBlockDialogSearchItemProps) => {
  return (
    <div className="flex items-center justify-start gap-2">
      <Avatar className="size-9">
        <AvatarFallback>{number}</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">
          {position} •{" "}
          {isPlayerAvailableForTrainingBlock(playerId, selectedTrainingBlockId) ? "Available" : "Not Available"}{" "}
          {trainingBlockId ? "(Assigned)" : ""}
        </p>
      </div>
    </div>
  );
};

export default TrainingBlockDialogSearchItem;
