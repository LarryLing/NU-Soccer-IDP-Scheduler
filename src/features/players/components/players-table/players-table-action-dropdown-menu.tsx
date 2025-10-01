import { Ellipsis, CalendarOff, PencilIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Player } from "@/schemas/player.schema";

import type { UsePlayerSheetReturn } from "../../hooks/use-player-sheet";
import { usePlayersActions } from "../../hooks/use-players-store";

type PlayersTableActionDropdownMenuProps = {
  playerId: Player["id"];
  openPlayerSheet: UsePlayerSheetReturn["openPlayerSheet"];
};

export const PlayersTableActionDropdownMenu = ({ playerId, openPlayerSheet }: PlayersTableActionDropdownMenuProps) => {
  const { clearPlayerAvailabilities, deletePlayer } = usePlayersActions();

  const handleClearPlayerAvailabilities = () => {
    clearPlayerAvailabilities(playerId);
  };

  const handleDeletePlayer = () => {
    deletePlayer(playerId);
  };

  const handleOpenPlayerSheet = () => {
    openPlayerSheet(playerId);
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
        <DropdownMenuItem onClick={handleClearPlayerAvailabilities} variant="destructive">
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
