import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PencilIcon, TrashIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

type ActionContextMenuProps = {
  handleDeletePlayer: () => Promise<void>;
  handleOpenPlayerSheet: () => void;
} & PropsWithChildren;

export function ActionContextMenu({
  children,
  handleDeletePlayer,
  handleOpenPlayerSheet,
}: ActionContextMenuProps) {
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
