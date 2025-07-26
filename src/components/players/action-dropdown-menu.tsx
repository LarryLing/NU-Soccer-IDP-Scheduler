import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, PencilIcon, TrashIcon } from "lucide-react";
import type { Player, UsePlayersReturn, UsePlayersSheetReturn } from "@/lib/types";
import { memo } from "react";
import { Button } from "../ui/button";

type ActionDropdownMenuProps = {
  id: Player["id"];
  deletePlayer: UsePlayersReturn["deletePlayer"];
  openPlayerSheet: UsePlayersSheetReturn["openPlayerSheet"];
}

export const ActionDropdownMenu = ({
  id,
  deletePlayer,
  openPlayerSheet,
}: ActionDropdownMenuProps) => {
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
