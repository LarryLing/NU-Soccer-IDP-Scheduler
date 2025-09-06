import { CalendarOff, Download, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import usePlayersStore from "@/features/players/hooks/use-players-store";
import { exportJson } from "@/lib/json";

import { useScheduleSheet } from "../hooks/use-schedule-sheet";
import useTrainingBlocksStore from "../hooks/use-training-blocks-store";

import ScheduleSheet from "./schedule-form/schedule-sheet";
import UnassignedPlayersPopover from "./unassigned-players-popover";

const ScheduleActionBar = () => {
  const trainingBlocks = useTrainingBlocksStore((state) => state.trainingBlocks);

  const scheduleSheetReturn = useScheduleSheet();

  const handleExportTrainingBlocksJson = () => {
    const filename = `training_blocks_${Date.now()}`;
    exportJson(trainingBlocks, filename);
  };

  const handleClearSchedule = () => {
    const players = usePlayersStore.getState().players;
    const updatePlayer = usePlayersStore.getState().updatePlayer;
    const setTrainingBlocks = useTrainingBlocksStore.getState().setTrainingBlocks;

    setTrainingBlocks([]);

    players.forEach((player) => {
      if (player.training_block_id === null) return;

      updatePlayer({
        ...player,
        training_block_id: null,
      });
    });
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
        <Button size="icon" variant="outline">
          <Upload />
        </Button>
      </div>
    </div>
  );
};

export default ScheduleActionBar;
