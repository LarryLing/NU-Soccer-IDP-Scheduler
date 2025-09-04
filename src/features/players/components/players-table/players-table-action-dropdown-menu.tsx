import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePlayersStore from "../../hooks/use-players-store";
import type { Player } from "@/types/player.type";
import type { UsePlayerSheetReturn } from "../../hooks/use-player-sheet";

type PlayersTableActionDropdownMenuProps = {
  id: Player["id"];
  openPlayerSheet: UsePlayerSheetReturn["openPlayerSheet"];
};

export const PlayersTableActionDropdownMenu = ({ id, openPlayerSheet }: PlayersTableActionDropdownMenuProps) => {
  const handleDeletePlayer = () => {
    const deletePlayer = usePlayersStore.getState().deletePlayer;
    deletePlayer(id);
  };

  const handleOpenPlayerSheet = () => {
    openPlayerSheet(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleOpenPlayerSheet}>
          <PencilIcon />
          Edit Player
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeletePlayer}>
          <TrashIcon color="red" />
          Delete Player
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlayersTableActionDropdownMenu;
