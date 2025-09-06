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
import usePlayersStore from "../../hooks/use-players-store";

type PlayersTableActionDropdownMenuProps = {
  playerId: Player["id"];
  openPlayerSheet: UsePlayerSheetReturn["openPlayerSheet"];
};

export const PlayersTableActionDropdownMenu = ({ playerId, openPlayerSheet }: PlayersTableActionDropdownMenuProps) => {
  const handleClearAvailability = () => {
    const { players, setPlayers } = usePlayersStore.getState();

    const updatedPlayers = [...players].map((player) => {
      if (player.id === playerId) {
        return {
          ...player,
          availabilities: [],
        };
      }

      return player;
    });

    setPlayers(updatedPlayers);
  };

  const handleDeletePlayer = () => {
    const { players, setPlayers } = usePlayersStore.getState();

    const updatedPlayers = [...players].filter((player) => player.id !== playerId);
    setPlayers(updatedPlayers);
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
