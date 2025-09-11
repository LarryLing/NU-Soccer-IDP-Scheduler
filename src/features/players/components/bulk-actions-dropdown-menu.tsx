import { CalendarOff, TrashIcon, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Player } from "@/schemas/player.schema";

import { usePlayersActions } from "../hooks/use-players-store";

type BulkActionsDropdownMenuProps = {
  selectedPlayerIds: Player["id"][];
};

const BulkActionsDropdownMenu = ({ selectedPlayerIds }: BulkActionsDropdownMenuProps) => {
  const { clearManyPlayerAvailabilities, deleteManyPlayers } = usePlayersActions();

  const handleClearManyPlayerAvailabilities = () => {
    clearManyPlayerAvailabilities(selectedPlayerIds);
  };

  const handleDeleteManyPlayers = () => {
    deleteManyPlayers(selectedPlayerIds);
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
        <DropdownMenuItem onClick={handleClearManyPlayerAvailabilities} variant="destructive">
          <CalendarOff />
          Clear Availabilities
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteManyPlayers} variant="destructive">
          <TrashIcon />
          Delete Players
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BulkActionsDropdownMenu;
