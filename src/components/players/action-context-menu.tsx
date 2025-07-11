import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { Player } from "@/lib/types";
import { PencilIcon, TrashIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

type ActionContextMenuProps = {
  player: Player;
  deletePlayer: (playerId: string) => Promise<void>;
} & PropsWithChildren;

export default function ActionContextMenu({
  children,
  player,
  deletePlayer,
}: ActionContextMenuProps) {
  const handleEditPlayer = async () => {
    console.log(player);
    throw new Error("Not implemented");
  };

  const handleDeletePlayer = async () => {
    await deletePlayer(player.id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleEditPlayer}>
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
