import { memo } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Player } from "@/schemas/player.schema";

type UnassignedPlayersPopoverItemProps = Pick<Player, "name" | "number" | "position">;

const UnassignedPlayersPopoverItem = ({ name, number, position }: UnassignedPlayersPopoverItemProps) => {
  return (
    <div className="flex items-center justify-start gap-2 px-2 py-1.5">
      <Avatar className="size-9">
        <AvatarFallback>{number}</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{position}</p>
      </div>
    </div>
  );
};

export default memo(UnassignedPlayersPopoverItem);
