import type { Table } from "@tanstack/react-table";
import { Download, PlusIcon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { exportJson } from "@/lib/json";

import type { Player } from "../../../types/player.type";
import type { UsePlayerSheetReturn } from "../hooks/use-player-sheet";
import usePlayersStore from "../hooks/use-players-store";

import { BulkActionsDropdownMenu } from "./bulk-actions-dropdown-menu";

type ActionBarProps = {
  table: Table<Player>;
  openPlayerSheet: UsePlayerSheetReturn["openPlayerSheet"];
};

const PlayersActionBar = ({ table, openPlayerSheet }: ActionBarProps) => {
  const selectedPlayerIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);

  const handleOpenPlayerSheet = () => {
    openPlayerSheet();
  };

  const handleExportPlayerJson = () => {
    const players = usePlayersStore.getState().players;
    const filename = `players_${Date.now()}`;
    exportJson(players, filename);
  };

  return (
    <div className="w-full flex justify-between items-center gap-x-2">
      <div className="flex gap-x-2">
        <Button onClick={handleOpenPlayerSheet}>
          <PlusIcon />
          Add Player
        </Button>
        {selectedPlayerIds.length > 0 && <BulkActionsDropdownMenu selectedPlayerIds={selectedPlayerIds} />}
      </div>
      <div className="flex gap-x-2">
        <Button size="icon" variant="outline" onClick={handleExportPlayerJson}>
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
