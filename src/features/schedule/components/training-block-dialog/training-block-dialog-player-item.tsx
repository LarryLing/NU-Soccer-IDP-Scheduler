import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import type { UseTrainingBlockDialogType } from "../../hooks/use-training-block-dialog";
import { isPlayerAvailableForTrainingBlock } from "../../lib/schedule";

type TrainingBlockDialogPlayerItemProps = {
  player: Player;
  trainingBlock: TrainingBlock;
  unassignPlayer: UseTrainingBlockDialogType["unassignPlayer"];
};

const TrainingBlockDialogPlayerItem = ({
  player,
  trainingBlock,
  unassignPlayer,
}: TrainingBlockDialogPlayerItemProps) => {
  const { id, name, number, position } = player;

  const handleUnassignPlayer = (e: string) => {
    if (e === "remove") unassignPlayer(id);
  };

  return (
    <div className="flex items-center justify-start gap-2">
      <Avatar>
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

export default TrainingBlockDialogPlayerItem;
