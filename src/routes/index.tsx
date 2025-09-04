import getColumns from "@/features/players/utils/get-columns";
import PlayersActionBar from "@/features/players/components/players-action-bar";
import { useEditPlayerSheet } from "@/features/players/hooks/use-edit-player-sheet";
import { usePlayersTable } from "@/features/players/hooks/use-players-table";
import { createFileRoute } from "@tanstack/react-router";
import PlayersTable from "@/features/players/components/players-table/players-table";
import EditPlayerSheet from "@/features/players/components/player-form/edit-player-sheet";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const editPlayerSheetReturn = useEditPlayerSheet();
  const { setPlayer, setIsEditPlayerSheetOpen } = editPlayerSheetReturn;

  const columns = getColumns(setPlayer, setIsEditPlayerSheetOpen);
  const { table } = usePlayersTable(columns);

  const selectedPlayerIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);

  return (
    <>
      <PlayersActionBar selectedPlayerIds={selectedPlayerIds} table={table} />
      <PlayersTable table={table} numColumns={columns.length} />
      <EditPlayerSheet {...editPlayerSheetReturn} />
    </>
  );
}
