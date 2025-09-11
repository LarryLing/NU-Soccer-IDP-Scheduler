import { memo } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Player } from "@/schemas/player.schema";

type TrainingBlockDialogSearchItemProps = { isPlayerAvailable: boolean; isPlayerAssigned: boolean } & Pick<
  Player,
  "name" | "number" | "position"
>;

const TrainingBlockDialogSearchItem = ({
  isPlayerAvailable,
  isPlayerAssigned,
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
          {position} • {isPlayerAvailable ? "Available" : "Not Available"} {isPlayerAssigned ? "(Assigned)" : ""}
        </p>
      </div>
    </div>
  );
};

export default memo(TrainingBlockDialogSearchItem);
