import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { usePlayers } from "@/hooks/usePlayers";
import { usePlayerSheet } from "@/hooks/usePlayerSheet";
import { PencilIcon, TrashIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import type { Player } from "@/lib/types";
import { memo } from "react";

type ActionContextMenuProps = {
  id: Player["id"];
} & PropsWithChildren;

export const ActionContextMenu = memo(function ActionContextMenu({
  children,
  id,
}: ActionContextMenuProps) {
  const { deletePlayer } = usePlayers();

  const { openPlayerSheet } = usePlayerSheet();

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
});
