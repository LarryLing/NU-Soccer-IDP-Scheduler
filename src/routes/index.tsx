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
  const { players, deletePlayer } = usePlayers();

  const {
    isPlayerSheetOpen,
    setIsPlayerSheetOpen,
    handleOpenPlayerSheet,
    playerToEdit,
  } = usePlayerSheet();

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
          deletePlayer={deletePlayer}
          table={table}
          handleOpenPlayerSheet={handleOpenPlayerSheet}
        />
      </section>
      <section className="sm:px-8 px-4">
        {display === "players" && (
          <PlayersTable
            table={table}
            numColumns={columns.length}
            deletePlayer={deletePlayer}
            handleOpenPlayerSheet={handleOpenPlayerSheet}
          />
        )}
      </section>
      <PlayerSheet
        isPlayerSheetOpen={isPlayerSheetOpen}
        setIsPlayerSheetOpen={setIsPlayerSheetOpen}
        playerToEdit={playerToEdit}
      />
    </div>
  );
}
