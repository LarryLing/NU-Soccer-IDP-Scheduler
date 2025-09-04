import getColumns from "@/features/players/lib/get-columns";
import PlayersActionBar from "@/features/players/components/players-action-bar";
import { usePlayersTable } from "@/features/players/hooks/use-players-table";
import { createFileRoute } from "@tanstack/react-router";
import PlayersTable from "@/features/players/components/players-table/players-table";
import { usePlayerSheet } from "@/features/players/hooks/use-player-sheet";
import PlayerSheet from "@/features/players/components/player-form/player-sheet";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const playerSheetReturn = usePlayerSheet();
  const { openPlayerSheet } = playerSheetReturn;

  const columns = getColumns(openPlayerSheet);
  const { table } = usePlayersTable(columns);

  const selectedPlayerIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);

  return (
    <>
      <PlayersActionBar selectedPlayerIds={selectedPlayerIds} table={table} {...playerSheetReturn} />
      <PlayersTable table={table} numColumns={columns.length} />
      <PlayerSheet {...playerSheetReturn} />
    </>
  );
}
