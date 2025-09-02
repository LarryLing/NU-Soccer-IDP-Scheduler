import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import UnassignedPlayersPopover from "./unassigned-players-popover";

type ScheduleActionBarProps = {
  openScheduleSheet: () => void;
  unassignedPlayerNames: string[];
};

const ScheduleActionBar = ({ openScheduleSheet, unassignedPlayerNames }: ScheduleActionBarProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Button onClick={openScheduleSheet}>
        <CalendarIcon />
        Create Schedule
      </Button>
      {unassignedPlayerNames.length > 0 && <UnassignedPlayersPopover unassignedPlayerNames={unassignedPlayerNames} />}
    </div>
  );
};

export default ScheduleActionBar;
