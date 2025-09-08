import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import type { UseTrainingBlockDialogReturn } from "../../hooks/use-training-block-dialog";
import { isPlayerAvailableForTrainingBlock } from "../../lib/schedule";

type TrainingBlockDialogAssignedPlayersItemProps = {
  player: Player;
  trainingBlock: TrainingBlock;
  unassignPlayer: UseTrainingBlockDialogReturn["unassignPlayer"];
};

const TrainingBlockDialogAssignedPlayersItem = ({
  player,
  trainingBlock,
  unassignPlayer,
}: TrainingBlockDialogAssignedPlayersItemProps) => {
  const { id, name, number, position } = player;

  const handleUnassignPlayer = (value: string) => {
    if (value === "remove") unassignPlayer(id);
  };

  return (
    <div className="flex items-center justify-start gap-2">
      <Avatar className="size-9">
        <AvatarFallback>{number}</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{position}</p>
      </div>
      <Select defaultValue="availablility-status" onValueChange={handleUnassignPlayer}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="center">
          <SelectItem value="availablility-status">
            {isPlayerAvailableForTrainingBlock(player, trainingBlock) ? "Available" : "Not Available"}
          </SelectItem>
          <SelectItem value="remove">Remove</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TrainingBlockDialogAssignedPlayersItem;
