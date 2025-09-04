import UnassignedPlayersPopover from "./unassigned-players-popover";
import ScheduleSheet from "./schedule-form/schedule-sheet";
import { useScheduleSheet } from "../hooks/use-schedule-sheet";
import usePlayersStore from "@/features/players/hooks/use-players-store";

const ScheduleActionBar = () => {
  const players = usePlayersStore((state) => state.players);

  const scheduleSheetReturn = useScheduleSheet();

  const unassignedPlayerNames = players
    .filter((player) => player.training_block_id === null)
    .map((player) => player.name);

  return (
    <div className="flex items-center space-x-3">
      <ScheduleSheet {...scheduleSheetReturn} />
      {unassignedPlayerNames.length > 0 && <UnassignedPlayersPopover unassignedPlayerNames={unassignedPlayerNames} />}
    </div>
  );
};

export default ScheduleActionBar;
