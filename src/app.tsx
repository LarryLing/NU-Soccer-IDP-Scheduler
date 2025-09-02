import ActionBar from "@/components/misc/action-bar";
import { Calendar } from "lucide-react";
import { useState } from "react";
import PlayerSheet from "./features/players/components/player-form/player-sheet";
import { PlayersTable } from "./features/players/components/players-table/players-table";
import ScheduleSheet from "./features/schedule/components/field-availability-form/schedule-sheet";
import { useScheduleSheet } from "./features/schedule/hooks/useScheduleSheet";

export function App() {
  const scheduleSheetReturn = useScheduleSheet(players);
  const { isCreatingSchedule, unassignedPlayerNames, openScheduleSheet } = scheduleSheetReturn;

  const [display, setDisplay] = useState<"players" | "schedule">("players");

  return (
    <div className="flex flex-col h-screen gap-y-4">
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
      <section className="sm:px-8 px-4 sm:pb-8 pb-4">
        {display === "players" && <PlayersTable table={table} numColumns={columns.length} />}
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
