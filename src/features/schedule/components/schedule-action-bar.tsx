import UnassignedPlayersPopover from "./unassigned-players-popover";
import ScheduleSheet from "./schedule-form/schedule-sheet";
import { useScheduleSheet } from "../hooks/use-schedule-sheet";

type ScheduleActionBarProps = {
  unassignedPlayerNames: string[];
};

const ScheduleActionBar = ({ unassignedPlayerNames }: ScheduleActionBarProps) => {
  const scheduleSheetReturn = useScheduleSheet();

  return (
    <div className="flex items-center space-x-3">
      <ScheduleSheet {...scheduleSheetReturn} />
      {unassignedPlayerNames.length > 0 && <UnassignedPlayersPopover unassignedPlayerNames={unassignedPlayerNames} />}
    </div>
  );
};

export default ScheduleActionBar;
