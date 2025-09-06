import type { Table } from "@tanstack/react-table";
import { Download, PlusIcon, TrashIcon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Player } from "../../../types/player.type";
import type { UsePlayerSheetReturn } from "../hooks/use-player-sheet";
import usePlayersStore from "../hooks/use-players-store";

type ActionBarProps = {
  selectedPlayerIds: string[];
  table: Table<Player>;
  openPlayerSheet: UsePlayerSheetReturn["openPlayerSheet"];
};

const PlayersActionBar = ({ selectedPlayerIds, table, openPlayerSheet }: ActionBarProps) => {
  const deletePlayer = usePlayersStore((state) => state.deletePlayer);

  const handleDeletePlayers = () => {
    table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)
      .forEach((playerId) => deletePlayer(playerId));
    table.resetRowSelection();
  };

  const handleOpenPlayerSheet = () => {
    openPlayerSheet();
  };

  return (
    <div className="w-full flex justify-between items-center gap-x-2">
      <div className="flex gap-x-2">
        <Button onClick={handleOpenPlayerSheet}>
          <PlusIcon />
          Add Player
        </Button>
        {selectedPlayerIds.length > 0 && (
          <Button variant="destructive" onClick={handleDeletePlayers}>
            <TrashIcon />
            Remove {selectedPlayerIds.length} Player
            {selectedPlayerIds.length > 1 ? "s" : ""}
          </Button>
        )}
      </div>
      <div className="flex gap-x-2">
        <Button size="icon" variant="outline">
          <Download />
        </Button>
        <Button size="icon" variant="outline">
          <Upload />
        </Button>
      </div>
    </div>
  );
};

export default PlayersActionBar;
