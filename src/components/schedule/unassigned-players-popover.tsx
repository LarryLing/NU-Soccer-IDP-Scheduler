import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Player } from "@/lib/types";
import { CalendarX2 } from "lucide-react";
import { Button } from "../ui/button";

type UnassignedPlayersPopoverProps = {
  unassignedPlayerNames: Player["name"][];
};

export default function UnassignedPlayersPopover({
  unassignedPlayerNames,
}: UnassignedPlayersPopoverProps) {
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
}
