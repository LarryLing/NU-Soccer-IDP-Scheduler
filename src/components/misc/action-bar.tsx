import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { CalendarIcon, PlusIcon, TrashIcon } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import type { Player } from "@/lib/types";
import type { UsePlayersReturn } from "@/features/players/hooks/usePlayers";
import type { UsePlayersSheetReturn } from "@/features/players/hooks/usePlayerSheet";
import type { UseScheduleSheetReturn } from "@/features/schedule/hooks/useScheduleSheet";
import UnassignedPlayersPopover from "@/features/schedule/components/unassigned-players-popover";

type ActionBarProps = {
  display: "players" | "schedule";
  setDisplay: (display: "players" | "schedule") => void;
  selectedPlayerIds: string[];
  table: Table<Player>;
  deletePlayer: UsePlayersReturn["deletePlayer"];
  openPlayerSheet: UsePlayersSheetReturn["openPlayerSheet"];
  openScheduleSheet: UseScheduleSheetReturn["openScheduleSheet"];
  unassignedPlayerNames: UseScheduleSheetReturn["unassignedPlayerNames"];
};

export default function ActionBar({
  display,
  setDisplay,
  selectedPlayerIds,
  table,
  deletePlayer,
  openPlayerSheet,
  openScheduleSheet,
  unassignedPlayerNames,
}: ActionBarProps) {
  const handleDeletePlayers = async () => {
    const selectedPlayerIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);

    const removePlayersPromise = selectedPlayerIds.map((playerId) => deletePlayer(playerId));

    await Promise.all(removePlayersPromise);
    table.resetRowSelection();
  };

  const handleOpenPlayerSheet = () => {
    openPlayerSheet(null);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-2">
      {display === "players" &&
        (selectedPlayerIds.length > 0 ? (
          <Button variant="destructive" onClick={handleDeletePlayers}>
            <TrashIcon />
            Remove {selectedPlayerIds.length} Player
            {selectedPlayerIds.length > 1 ? "s" : ""}
          </Button>
        ) : (
          <Button onClick={handleOpenPlayerSheet}>
            <PlusIcon />
            Add Player
          </Button>
        ))}
      {display === "schedule" && (
        <div className="flex items-center space-x-3">
          <Button onClick={openScheduleSheet}>
            <CalendarIcon />
            Create Schedule
          </Button>
          {unassignedPlayerNames.length > 0 && (
            <UnassignedPlayersPopover unassignedPlayerNames={unassignedPlayerNames} />
          )}
        </div>
      )}
      <Tabs defaultValue={display} onValueChange={(value) => setDisplay(value as "players" | "schedule")}>
        <TabsList>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
