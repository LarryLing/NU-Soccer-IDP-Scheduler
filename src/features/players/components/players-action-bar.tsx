import type { Table } from "@tanstack/react-table";
import { Download, PlusIcon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Player } from "../../../schemas/player.schema";
import type { UsePlayerSheetReturn } from "../hooks/use-player-sheet";
import usePlayersJson from "../hooks/use-players-json";

import { BulkActionsDropdownMenu } from "./bulk-actions-dropdown-menu";

type ActionBarProps = {
  table: Table<Player>;
  openPlayerSheet: UsePlayerSheetReturn["openPlayerSheet"];
};

const PlayersActionBar = ({ table, openPlayerSheet }: ActionBarProps) => {
  const { fileInputRef, handleOpenFileInput, handleExportPlayersJson, handleImportPlayersJson } = usePlayersJson();

  const selectedPlayerIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);

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
        {selectedPlayerIds.length > 0 && <BulkActionsDropdownMenu selectedPlayerIds={selectedPlayerIds} />}
      </div>
      <div className="flex gap-x-2">
        <Button size="icon" variant="outline" onClick={handleExportPlayersJson}>
          <Download />
        </Button>
        <Button size="icon" variant="outline" onClick={handleOpenFileInput}>
          <Upload />
        </Button>
        <input
          ref={fileInputRef}
          id="hidden"
          type="file"
          accept=".json,application/json"
          onChange={handleImportPlayersJson}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default PlayersActionBar;
