import { Download, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import usePlayersStore from "@/features/players/hooks/use-players-store";

import { useScheduleSheet } from "../hooks/use-schedule-sheet";

import ScheduleSheet from "./schedule-form/schedule-sheet";
import UnassignedPlayersPopover from "./unassigned-players-popover";

const ScheduleActionBar = () => {
  const players = usePlayersStore((state) => state.players);

  const scheduleSheetReturn = useScheduleSheet();

  const unassignedPlayerNames = players
    .filter((player) => player.training_block_id === null)
    .map((player) => player.name);

  return (
    <div className="w-full flex justify-between items-center gap-x-2">
      <div className="flex gap-x-2">
        <ScheduleSheet {...scheduleSheetReturn} />
        {unassignedPlayerNames.length > 0 && <UnassignedPlayersPopover unassignedPlayerNames={unassignedPlayerNames} />}
      </div>
      <div className="flex gap-x-2">
        <Button size="icon" variant="outline">
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
