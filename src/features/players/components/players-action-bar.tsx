import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import type { Player } from "../../../types/player.type";
import type { UsePlayersReturn } from "../hooks/usePlayers";
import type { UsePlayersSheetReturn } from "../hooks/usePlayerSheet";

type ActionBarProps = {
  selectedPlayerIds: string[];
  table: Table<Player>;
  deletePlayer: UsePlayersReturn["deletePlayer"];
  openPlayerSheet: UsePlayersSheetReturn["openPlayerSheet"];
};

const PlayersActionBar = ({ selectedPlayerIds, table, deletePlayer, openPlayerSheet }: ActionBarProps) => {
  const handleDeletePlayers = async () => {
    const selectedPlayerIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);

    const removePlayersPromise = selectedPlayerIds.map((playerId) => deletePlayer(playerId));

    await Promise.all(removePlayersPromise);
    table.resetRowSelection();
  };

  const handleOpenPlayerSheet = () => {
    openPlayerSheet(null);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-2">
      {selectedPlayerIds.length > 0 ? (
        <Button variant="destructive" onClick={handleDeletePlayers}>
          <TrashIcon />
          Remove {selectedPlayerIds.length} Player
          {selectedPlayerIds.length > 1 ? "s" : ""}
        </Button>
      ) : (
        <Button onClick={handleOpenPlayerSheet}>
          <PlusIcon />
          Add Player
        </Button>
      )}
    </div>
  );
};

export default PlayersActionBar;
