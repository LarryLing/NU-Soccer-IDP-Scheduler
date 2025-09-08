import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { isPlayerAvailableForTrainingBlock } from "../../lib/schedule";

type TrainingBlockDialogSearchItemProps = {
  player: Player;
  trainingBlock: TrainingBlock;
};

const TrainingBlockDialogSearchItem = ({ player, trainingBlock }: TrainingBlockDialogSearchItemProps) => {
  const { trainingBlockId, name, number, position } = player;

  return (
    <div className="flex items-center justify-start gap-2">
      <Avatar className="size-9">
        <AvatarFallback>{number}</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">
          {`${position} • ${isPlayerAvailableForTrainingBlock(player, trainingBlock) ? "Available" : "Not Available"} ${trainingBlockId ? "(Assigned)" : ""}`}
        </p>
      </div>
    </div>
  );
};

export default TrainingBlockDialogSearchItem;
