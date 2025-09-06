import { createFileRoute } from "@tanstack/react-router";

import PlayerSheet from "@/features/players/components/player-form/player-sheet";
import PlayersActionBar from "@/features/players/components/players-action-bar";
import PlayersTable from "@/features/players/components/players-table/players-table";
import { usePlayerSheet } from "@/features/players/hooks/use-player-sheet";
import { usePlayersTable } from "@/features/players/hooks/use-players-table";
import getColumns from "@/features/players/lib/get-columns";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const playerSheetReturn = usePlayerSheet();
  const { openPlayerSheet } = playerSheetReturn;

  const columns = getColumns(openPlayerSheet);
  const { table } = usePlayersTable(columns);

  return (
    <>
      <PlayersActionBar table={table} {...playerSheetReturn} />
      <PlayersTable table={table} numColumns={columns.length} />
      <PlayerSheet {...playerSheetReturn} />
    </>
  );
}
