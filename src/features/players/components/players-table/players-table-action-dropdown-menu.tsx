import { Ellipsis, CalendarOff, PencilIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Player } from "@/types/player.type";

import type { UsePlayerSheetReturn } from "../../hooks/use-player-sheet";
import usePlayersStore from "../../hooks/use-players-store";

type PlayersTableActionDropdownMenuProps = {
  player: Player;
  openPlayerSheet: UsePlayerSheetReturn["openPlayerSheet"];
};

export const PlayersTableActionDropdownMenu = ({ player, openPlayerSheet }: PlayersTableActionDropdownMenuProps) => {
  const handleClearAvailability = () => {
    const updatePlayer = usePlayersStore.getState().updatePlayer;
    updatePlayer({
      ...player,
      availabilities: [],
    });
  };

  const handleDeletePlayer = () => {
    const deletePlayer = usePlayersStore.getState().deletePlayer;
    deletePlayer(player.id);
  };

  const handleOpenPlayerSheet = () => {
    openPlayerSheet(player.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleOpenPlayerSheet}>
          <PencilIcon />
          Edit Player
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleClearAvailability} variant="destructive">
          <CalendarOff />
          Clear Availabilities
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeletePlayer} variant="destructive">
          <TrashIcon />
          Delete Player
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlayersTableActionDropdownMenu;
