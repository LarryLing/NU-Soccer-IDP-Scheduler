import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import type { Player } from "../../../types/player.type";
import AddPlayerSheet from "./player-form/add-player-sheet";
import usePlayersStore from "../hooks/use-players-store";

type ActionBarProps = {
  selectedPlayerIds: string[];
  table: Table<Player>;
};

const PlayersActionBar = ({ selectedPlayerIds, table }: ActionBarProps) => {
  const deletePlayer = usePlayersStore((state) => state.deletePlayer);

  const handleDeletePlayers = () => {
    table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)
      .forEach((playerId) => deletePlayer(playerId));
    table.resetRowSelection();
  };

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-2">
      <AddPlayerSheet />
      {selectedPlayerIds.length > 0 && (
        <Button variant="destructive" onClick={handleDeletePlayers}>
          <TrashIcon />
          Remove {selectedPlayerIds.length} Player
          {selectedPlayerIds.length > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );
};

export default PlayersActionBar;
