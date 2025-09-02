import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, PencilIcon, TrashIcon } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import type { Player } from "../../../../types/player.type";
import type { UsePlayersReturn } from "../../hooks/usePlayers";
import type { UsePlayersSheetReturn } from "../../hooks/usePlayerSheet";

type ActionDropdownMenuProps = {
  id: Player["id"];
  deletePlayer: UsePlayersReturn["deletePlayer"];
  openPlayerSheet: UsePlayersSheetReturn["openPlayerSheet"];
};

export const ActionDropdownMenu = ({ id, deletePlayer, openPlayerSheet }: ActionDropdownMenuProps) => {
  const handleDeletePlayer = async () => {
    await deletePlayer(id);
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

export default memo(ActionDropdownMenu);
