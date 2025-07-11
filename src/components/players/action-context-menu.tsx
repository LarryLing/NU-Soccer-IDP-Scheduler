import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { usePlayerSheet } from "@/hooks/usePlayerSheet";
import type { Player } from "@/lib/types";
import { PencilIcon, TrashIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

type ActionContextMenuProps = {
  player: Player;
  handleDeletePlayer: () => Promise<void>;
} & PropsWithChildren;

export function ActionContextMenu({
  children,
  player,
  handleDeletePlayer,
}: ActionContextMenuProps) {
  const { openPlayerSheet } = usePlayerSheet();

  const handleOpenPlayerSheet = () => {
    openPlayerSheet(player);
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
}
