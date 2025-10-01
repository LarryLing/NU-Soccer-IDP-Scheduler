import { memo } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Player } from "@/schemas/player.schema";

import type { UseEditTrainingBlockDialogReturn } from "../../hooks/use-edit-training-block-dialog";

type AssignedPlayersItemProps = {
  isPlayerAvailable: boolean;
} & Pick<Player, "id" | "name" | "number" | "position"> &
  Pick<UseEditTrainingBlockDialogReturn, "removeAssignment">;

const AssignedPlayersItem = ({
  isPlayerAvailable,
  id,
  name,
  number,
  position,
  removeAssignment,
}: AssignedPlayersItemProps) => {
  const handleRemoveAssignment = (value: string) => {
    if (value === "remove") removeAssignment(id);
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
      <Select defaultValue="availablility-status" onValueChange={handleRemoveAssignment}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="center">
          <SelectItem value="availablility-status">{isPlayerAvailable ? "Available" : "Not Available"}</SelectItem>
          <SelectItem value="remove">Remove</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default memo(AssignedPlayersItem);
