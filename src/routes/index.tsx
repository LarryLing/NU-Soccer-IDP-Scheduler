import ActionBar from "@/components/misc/action-bar";
import Navbar from "@/components/misc/navbar";
import { columns } from "@/components/players/columns";
import PlayerSheet from "@/components/players/player-sheet";
import { PlayersTable } from "@/components/players/players-table";
import ScheduleSheet from "@/components/schedule/schedule-sheet";
import Calendar from "@/components/schedule/calendar";
import { usePlayers } from "@/hooks/usePlayers";
import { usePlayerSheet } from "@/hooks/usePlayerSheet";
import { usePlayersTable } from "@/hooks/usePlayersTable";
import { useScheduleSheet } from "@/hooks/useScheduleSheet";
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
  const playersReturn = usePlayers();
  const { players, insertPlayer, updatePlayer, deletePlayer } = playersReturn;

  const playerSheetReturn = usePlayerSheet(players, insertPlayer, updatePlayer);
  const { openPlayerSheet } = playerSheetReturn;

  const scheduleSheetReturn = useScheduleSheet(players);
  const { openScheduleSheet, trainingBlocks, unassignedPlayerNames } = scheduleSheetReturn;

  const table = usePlayersTable(players, columns);

  const [display, setDisplay] = useState<"players" | "schedule">("players");

  const selectedPlayerIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);

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
          openScheduleSheet={openScheduleSheet}
          unassignedPlayerNames={unassignedPlayerNames}
        />
      </section>
      <section className="sm:px-8 px-4 pb-4">
        {display === "players" && (
          <PlayersTable
            table={table}
            numColumns={columns.length}
            deletePlayer={deletePlayer}
            openPlayerSheet={openPlayerSheet}
          />
        )}
        {display === "schedule" && <Calendar players={players} trainingBlocks={trainingBlocks} />}
      </section>
      {display === "players" && <PlayerSheet {...playerSheetReturn} />}
      {display === "schedule" && <ScheduleSheet {...scheduleSheetReturn} />}
    </div>
  );
}
