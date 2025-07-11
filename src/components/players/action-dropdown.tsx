import type { Table } from "@tanstack/react-table";
import type { Player } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisIcon, PencilIcon, TrashIcon } from "lucide-react";

type ActionDropdownProps = {
  player: Player;
  table: Table<Player>;
};

export default function ActionDropdown({ player, table }: ActionDropdownProps) {
  const handleEditPlayer = async () => {
    console.log(player);
    throw new Error("Not implemented");
  };

  const handleRemovePlayer = async () => {
    table.resetRowSelection();
    throw new Error("Not implemented");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem onClick={handleEditPlayer}>
          <PencilIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRemovePlayer}>
          <TrashIcon color="red" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
