import getColumns from "@/features/players/components/players-table/columns";
import PlayersActionBar from "@/features/players/components/players-action-bar";
import { usePlayers } from "@/features/players/hooks/usePlayers";
import { usePlayerSheet } from "@/features/players/hooks/usePlayerSheet";
import { usePlayersTable } from "@/features/players/hooks/usePlayersTable";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const playersReturn = usePlayers();
  const { players, createPlayer, updatePlayer, deletePlayer } = playersReturn;

  const playerSheetReturn = usePlayerSheet(players, createPlayer, updatePlayer);
  const { openPlayerSheet } = playerSheetReturn;

  const columns = getColumns(deletePlayer, openPlayerSheet);
  const { table } = usePlayersTable(players, columns);

  const selectedPlayerIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);

  return (
    <>
      <PlayersActionBar
        selectedPlayerIds={selectedPlayerIds}
        table={table}
        deletePlayer={deletePlayer}
        openPlayerSheet={openPlayerSheet}
      />
    </>
  );
}
