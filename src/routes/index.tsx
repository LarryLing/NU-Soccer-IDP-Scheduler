import ActionBar from "@/components/misc/action-bar";
import Navbar from "@/components/misc/navbar";
import { columns } from "@/components/players/columns";
import PlayerSheet from "@/components/players/player-sheet";
import { PlayersTable } from "@/components/players/players-table";
import { usePlayers } from "@/hooks/usePlayers";
import { usePlayerSheet } from "@/hooks/usePlayerSheet";
import { usePlayersTable } from "@/hooks/usePlayersTable";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: Index,
});

function Index() {
  const { players, insertPlayer, updatePlayer, deletePlayer } = usePlayers();

  const {
    openPlayerSheet,
    playerMetadata,
    isPlayerSheetOpen,
    setIsPlayerSheetOpen,
    form,
    fieldArray,
    addAvailability,
  } = usePlayerSheet(players);

  const table = usePlayersTable(players, columns);

  const [display, setDisplay] = useState<"players" | "schedule">("players");

  const selectedPlayerIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);

  return (
    <div className="flex flex-col h-screen gap-y-4">
      <Navbar />
      <section className="sm:px-8 px-4">
        <ActionBar
          display={display}
          setDisplay={setDisplay}
          selectedPlayerIds={selectedPlayerIds}
          table={table}
          deletePlayer={deletePlayer}
          openPlayerSheet={openPlayerSheet}
        />
      </section>
      <section className="sm:px-8 px-4">
        {display === "players" && (
          <PlayersTable
            table={table}
            numColumns={columns.length}
            deletePlayer={deletePlayer}
            openPlayerSheet={openPlayerSheet}
          />
        )}
      </section>
      <PlayerSheet
        form={form}
        playerMetadata={playerMetadata}
        isPlayerSheetOpen={isPlayerSheetOpen}
        setIsPlayerSheetOpen={setIsPlayerSheetOpen}
        fieldArray={fieldArray}
        addAvailability={addAvailability}
        insertPlayer={insertPlayer}
        updatePlayer={updatePlayer}
      />
    </div>
  );
}
