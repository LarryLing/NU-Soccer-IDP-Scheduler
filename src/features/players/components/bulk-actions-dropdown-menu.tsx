import { CalendarOff, TrashIcon, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Player } from "@/types/player.type";

import usePlayersStore from "../hooks/use-players-store";

type BulkActionsDropdownMenuProps = {
  selectedPlayerIds: Player["id"][];
};

export const BulkActionsDropdownMenu = ({ selectedPlayerIds }: BulkActionsDropdownMenuProps) => {
  const players = usePlayersStore((state) => state.players);
  const setPlayers = usePlayersStore((state) => state.setPlayers);

  const handleClearAvailabilities = () => {
    const updatedPlayers = [...players].map((player) => {
      return {
        ...player,
        availabilities: [],
      };
    });

    setPlayers(updatedPlayers);
  };

  const handleDeletePlayers = () => {
    setPlayers([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <UsersRound />
          {selectedPlayerIds.length > 1
            ? `${selectedPlayerIds.length} Players Selected`
            : `${selectedPlayerIds.length} Player Selected`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleClearAvailabilities} variant="destructive">
          <CalendarOff />
          Clear Availabilities
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeletePlayers} variant="destructive">
          <TrashIcon />
          Delete Players
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
