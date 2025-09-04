import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, PencilIcon, TrashIcon } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import usePlayersStore from "../../hooks/use-players-store";
import type { Player } from "@/types/player.type";
import type { UseEditPlayerSheetReturn } from "../../hooks/use-edit-player-sheet";

type ActionDropdownMenuProps = {
  id: Player["id"];
  setPlayer: UseEditPlayerSheetReturn["setPlayer"];
  setIsEditPlayerSheetOpen: UseEditPlayerSheetReturn["setIsEditPlayerSheetOpen"];
};

export const ActionDropdownMenu = ({ id, setPlayer, setIsEditPlayerSheetOpen }: ActionDropdownMenuProps) => {
  const players = usePlayersStore((state) => state.players);
  const deletePlayer = usePlayersStore((state) => state.deletePlayer);

  const handleDeletePlayer = () => {
    deletePlayer(id);
  };

  const handleOpenEditPlayerSheet = () => {
    const player = players.find((player) => player.id === id);
    setPlayer(player);
    setIsEditPlayerSheetOpen(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleOpenEditPlayerSheet}>
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

export default memo(ActionDropdownMenu);
