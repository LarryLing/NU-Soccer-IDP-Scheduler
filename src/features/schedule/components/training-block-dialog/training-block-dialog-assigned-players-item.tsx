import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { isPlayerAvailableForTrainingBlock } from "../../lib/schedule";

type TrainingBlockDialogAssignedPlayersItemProps = {
  trainingBlockId: TrainingBlock["id"];
  unassignPlayer: (playerName: Player["name"]) => void;
} & Pick<Player, "id" | "name" | "number" | "position">;

const TrainingBlockDialogAssignedPlayersItem = ({
  trainingBlockId,
  id: playerId,
  name,
  number,
  position,
  unassignPlayer,
}: TrainingBlockDialogAssignedPlayersItemProps) => {
  const handleUnassignPlayer = (value: string) => {
    if (value === "remove") unassignPlayer(playerId);
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
            {isPlayerAvailableForTrainingBlock(playerId, trainingBlockId) ? "Available" : "Not Available"}
          </SelectItem>
          <SelectItem value="remove">Remove</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TrainingBlockDialogAssignedPlayersItem;
