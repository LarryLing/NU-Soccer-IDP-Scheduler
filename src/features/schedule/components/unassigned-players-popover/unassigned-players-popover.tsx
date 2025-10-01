import { CalendarX2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayers } from "@/features/players/hooks/use-players-store";

import UnassignedPlayersPopoverItem from "./unassigned-players-popover-item";

const UnassignedPlayersPopover = () => {
  const players = usePlayers();

  const unassignedPlayers = players.filter((player) => player.trainingBlockId === null);

  const scrollAreaHeight = Math.min(unassignedPlayers.length, 8);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarX2 />
          {unassignedPlayers.length} Unassigned Players
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <ScrollArea className={`h-[${scrollAreaHeight * 40}px] p-1`}>
          {unassignedPlayers.map((unassignedPlayer) => (
            <UnassignedPlayersPopoverItem key={unassignedPlayer.id} {...unassignedPlayer} />
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default UnassignedPlayersPopover;
