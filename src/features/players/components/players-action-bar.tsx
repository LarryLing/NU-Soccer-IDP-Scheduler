import { Download, PlusIcon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Player } from "../../../schemas/player.schema";
import type { UsePlayerSheetReturn } from "../hooks/use-player-sheet";
import usePlayersJson from "../hooks/use-players-json";

import BulkActionsDropdownMenu from "./bulk-actions-dropdown-menu";

type ActionBarProps = {
  selectedPlayerIds: Player["id"][];
  openPlayerSheet: UsePlayerSheetReturn["openPlayerSheet"];
};

const PlayersActionBar = ({ selectedPlayerIds, openPlayerSheet }: ActionBarProps) => {
  const { fileInputRef, handleOpenFileInput, handleExportPlayersJson, handleImportPlayersJson } = usePlayersJson();

  const handleOpenPlayerSheet = () => {
    openPlayerSheet();
  };

  return (
    <div className="w-full flex flex-wrap justify-start items-center gap-2">
      <Button onClick={handleOpenPlayerSheet}>
        <PlusIcon />
        Add Player
      </Button>
      {selectedPlayerIds.length > 0 && <BulkActionsDropdownMenu selectedPlayerIds={selectedPlayerIds} />}
      <Button variant="outline" onClick={handleExportPlayersJson}>
        <Download />
        Export Players
      </Button>
      <Button variant="outline" onClick={handleOpenFileInput}>
        <Upload />
        Import Players
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
  );
};

export default PlayersActionBar;
