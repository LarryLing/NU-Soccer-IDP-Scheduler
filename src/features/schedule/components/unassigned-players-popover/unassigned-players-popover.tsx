import { CalendarX2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import usePlayersStore from "@/features/players/hooks/use-players-store";

import UnassignedPlayersPopoverItem from "./unassigned-players-popover-item";

const UnassignedPlayersPopover = () => {
  const players = usePlayersStore((state) => state.players);

  const unassignedPlayers = players.filter((player) => player.trainingBlockId === null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarX2 />
          {unassignedPlayers.length} Unassigned Players
        </Button>
      </PopoverTrigger>
      <PopoverContent className="overflow-y-scroll max-h-[320px] p-1">
        {unassignedPlayers.map((unassignedPlayer) => (
          <UnassignedPlayersPopoverItem key={unassignedPlayer.id} {...unassignedPlayer} />
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default UnassignedPlayersPopover;
