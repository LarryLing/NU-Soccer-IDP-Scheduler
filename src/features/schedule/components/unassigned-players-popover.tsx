import { CalendarX2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Player } from "@/types/player.type";

type UnassignedPlayersPopoverProps = {
  unassignedPlayerNames: Player["name"][];
};

const UnassignedPlayersPopover = ({ unassignedPlayerNames }: UnassignedPlayersPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarX2 />
          {unassignedPlayerNames.length} unassigned players
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <p className="text-sm">{unassignedPlayerNames.join(", ")}</p>
      </PopoverContent>
    </Popover>
  );
};

export default UnassignedPlayersPopover;
