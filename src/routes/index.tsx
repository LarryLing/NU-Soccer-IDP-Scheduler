import getColumns from "@/features/players/components/players-table/columns";
import PlayersActionBar from "@/features/players/components/players-action-bar";
import { usePlayers } from "@/features/players/hooks/use-players";
import { usePlayerSheet } from "@/features/players/hooks/use-player-sheet";
import { usePlayersTable } from "@/features/players/hooks/use-players-table";
import { createFileRoute } from "@tanstack/react-router";
import PlayerSheet from "@/features/players/components/player-form/player-sheet";
import PlayersTable from "@/features/players/components/players-table/players-table";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const playersReturn = usePlayers();
  const { players, deletePlayer } = playersReturn;

  const playerSheetReturn = usePlayerSheet(players);
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
      <PlayersTable table={table} numColumns={columns.length} />
      <PlayerSheet {...playerSheetReturn} />
    </>
  );
}
