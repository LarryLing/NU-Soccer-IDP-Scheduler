import { Download, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { exportJson } from "@/lib/json";

import { useScheduleSheet } from "../hooks/use-schedule-sheet";
import useTrainingBlocksStore from "../hooks/use-training-blocks-store";

import ScheduleSheet from "./schedule-form/schedule-sheet";
import UnassignedPlayersPopover from "./unassigned-players-popover";

const ScheduleActionBar = () => {
  const scheduleSheetReturn = useScheduleSheet();

  const handleExportTrainingBlocksJson = () => {
    const trainingBlocks = useTrainingBlocksStore.getState().trainingBlocks;
    const filename = `training_blocks_${Date.now()}`;
    exportJson(trainingBlocks, filename);
  };

  return (
    <div className="w-full flex justify-between items-center gap-x-2">
      <div className="flex gap-x-2">
        <ScheduleSheet {...scheduleSheetReturn} />
        <UnassignedPlayersPopover />
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
