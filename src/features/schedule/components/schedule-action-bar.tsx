import { CalendarOff, Download, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import usePlayersStore from "@/features/players/hooks/use-players-store";

import { useScheduleSheet } from "../hooks/use-schedule-sheet";
import useTrainingBlocksJson from "../hooks/use-training-blocks-json";
import useTrainingBlocksStore from "../hooks/use-training-blocks-store";

import ScheduleSheet from "./schedule-form/schedule-sheet";
import UnassignedPlayersPopover from "./unassigned-players-popover";

const ScheduleActionBar = () => {
  const trainingBlocks = useTrainingBlocksStore((state) => state.trainingBlocks);

  const { fileInputRef, handleOpenFileInput, handleExportTrainingBlocksJson, handleImportTrainingBlocksJson } =
    useTrainingBlocksJson();

  const scheduleSheetReturn = useScheduleSheet();

  const handleClearSchedule = () => {
    const players = usePlayersStore.getState().players;
    const setPlayers = usePlayersStore.getState().setPlayers;
    const setTrainingBlocks = useTrainingBlocksStore.getState().setTrainingBlocks;

    const updatedPlayers = [...players].map((player) => {
      return {
        ...player,
        training_block_id: null,
      };
    });

    setTrainingBlocks([]);
    setPlayers(updatedPlayers);
  };

  return (
    <div className="w-full flex justify-between items-center gap-x-2">
      <div className="flex gap-x-2">
        <ScheduleSheet {...scheduleSheetReturn} />
        <UnassignedPlayersPopover />
        {trainingBlocks.length > 0 && (
          <Button variant="destructive" onClick={handleClearSchedule}>
            <CalendarOff />
            Clear
          </Button>
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
