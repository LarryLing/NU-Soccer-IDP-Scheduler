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
import { useState } from "react";

export function App() {
  const playersReturn = usePlayers();
  const { players, insertPlayer, updatePlayer, deletePlayer } = playersReturn;

  const playerSheetReturn = usePlayerSheet(players, insertPlayer, updatePlayer);
  const { openPlayerSheet } = playerSheetReturn;

  const scheduleSheetReturn = useScheduleSheet(players);
  const { isCreatingSchedule, unassignedPlayerNames, openScheduleSheet } = scheduleSheetReturn;

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
        {display === "schedule" &&
          (isCreatingSchedule ? (
            <p className="text-sm text-center w-full">Creating schedule...</p>
          ) : (
            <Calendar players={players} />
          ))}
      </section>
      {display === "players" && <PlayerSheet {...playerSheetReturn} />}
      {display === "schedule" && <ScheduleSheet {...scheduleSheetReturn} />}
    </div>
  );
}
