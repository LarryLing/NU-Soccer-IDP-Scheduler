import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Player } from "@/lib/types";
import { Badge } from "../ui/badge";
import { CircleAlert } from "lucide-react";

type UnassignedPlayersPopoverProps = {
  unassignedPlayerNames: Player["name"][];
};

export default function UnassignedPlayersPopover({
  unassignedPlayerNames,
}: UnassignedPlayersPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge variant="secondary">
          <CircleAlert />
          {unassignedPlayerNames.length} unassigned players
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <p className="text-sm">{unassignedPlayerNames.join(", ")}</p>
      </PopoverContent>
    </Popover>
  );
}
