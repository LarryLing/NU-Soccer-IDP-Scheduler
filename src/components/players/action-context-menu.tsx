import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PencilIcon, TrashIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import type { Player, UsePlayersReturn, UsePlayersSheetReturn } from "@/lib/types";
import { memo } from "react";

type ActionContextMenuProps = {
  id: Player["id"];
  deletePlayer: UsePlayersReturn["deletePlayer"];
  openPlayerSheet: UsePlayersSheetReturn["openPlayerSheet"];
} & PropsWithChildren;

export const ActionContextMenu = ({
  children,
  id,
  deletePlayer,
  openPlayerSheet,
}: ActionContextMenuProps) => {
  const handleDeletePlayer = async () => {
    await deletePlayer(id);
  };

  const handleOpenPlayerSheet = () => {
    openPlayerSheet(id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleOpenPlayerSheet}>
          <PencilIcon />
          Edit Player
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDeletePlayer}>
          <TrashIcon color="red" />
          Delete Player
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default memo(ActionContextMenu);
