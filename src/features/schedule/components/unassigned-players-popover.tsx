import { CalendarX2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import usePlayersStore from "@/features/players/hooks/use-players-store";

const UnassignedPlayersPopover = () => {
  const players = usePlayersStore((state) => state.players);

  const unassignedPlayerNames = players
    .filter((player) => player.training_block_id === null)
    .map((player) => player.name);

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
