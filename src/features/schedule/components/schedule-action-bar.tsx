import { CalendarIcon, CalendarOff, Download, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import usePlayersStore from "@/features/players/hooks/use-players-store";

import { useScheduleSheet } from "../hooks/use-schedule-settings-sheet";
import useScheduleStore from "../hooks/use-schedule-store";
import useTrainingBlocksJson from "../hooks/use-training-blocks-json";
import {
  assignPlayersToTrainingBlocks,
  generatePossibleTrainingBlocks,
  saveAssignedPlayers,
  saveUsedTrainingBlocks,
} from "../lib/schedule";

import ScheduleSheet from "./schedule-form/schedule-settings-sheet";
import UnassignedPlayersPopover from "./unassigned-players-popover";

const ScheduleActionBar = () => {
  const trainingBlocks = useScheduleStore((state) => state.trainingBlocks);

  const { fileInputRef, handleOpenFileInput, handleExportTrainingBlocksJson, handleImportTrainingBlocksJson } =
    useTrainingBlocksJson();

  const scheduleSheetReturn = useScheduleSheet();

  const handleClearSchedule = () => {
    const { players, setPlayers } = usePlayersStore.getState();
    const { setTrainingBlocks } = useScheduleStore.getState();

    const updatedPlayers = [...players].map((player) => {
      return {
        ...player,
        training_block_id: null,
      };
    });

    setTrainingBlocks([]);
    setPlayers(updatedPlayers);
  };

  const handleCreateSchedule = () => {
    const scheduleSettings = useScheduleStore.getState().scheduleSettings;
    const { availabilities, duration, maximumPlayerCount } = scheduleSettings;

    const possibleTrainingBlocks = generatePossibleTrainingBlocks(availabilities, duration);

    const { playerAssignmentsMap, usedTrainingBlocks } = assignPlayersToTrainingBlocks(
      possibleTrainingBlocks,
      maximumPlayerCount
    );

    saveUsedTrainingBlocks(usedTrainingBlocks);
    saveAssignedPlayers(playerAssignmentsMap);

    const playerAssignmentsValues = [...playerAssignmentsMap.values()];
    if (playerAssignmentsValues.some((playerAssignmentsValues) => playerAssignmentsValues === null)) {
      toast.warning("Some players could not be scheduled", {
        description: "Please double check player and field availability",
      });
    }

    toast.success("Successfully create training schedule");
  };

  return (
    <div className="w-full flex justify-between items-center gap-x-2">
      <div className="flex gap-x-2">
        <Button onClick={handleCreateSchedule}>
          <CalendarIcon />
          Create Schedule
        </Button>
        <ScheduleSheet {...scheduleSheetReturn} />
        {trainingBlocks.length > 0 && (
          <>
            <UnassignedPlayersPopover />
            <Button variant="destructive" onClick={handleClearSchedule}>
              <CalendarOff />
              Clear
            </Button>
          </>
        )}
      </div>
      <div className="flex gap-x-2">
        <Button size="icon" variant="outline" onClick={handleExportTrainingBlocksJson}>
          <Download />
        </Button>
        <Button size="icon" variant="outline" onClick={handleOpenFileInput}>
          <Upload />
        </Button>
        <input
          ref={fileInputRef}
          id="hidden"
          type="file"
          accept=".json,application/json"
          onChange={handleImportTrainingBlocksJson}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ScheduleActionBar;
