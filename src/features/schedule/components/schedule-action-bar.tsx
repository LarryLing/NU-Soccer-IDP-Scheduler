import { CalendarIcon, CalendarOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePlayers, usePlayersActions } from "@/features/players/hooks/use-players-store";
import type { Player } from "@/schemas/player.schema";

import { useScheduleActions, useTrainingBlocks } from "../hooks/use-schedule-store";

import ScheduleSheet from "./schedule-form/schedule-settings-sheet";
import CreateTrainingBlockDialog from "./training-block-dialog/create-training-block-dialog";
import UnassignedPlayersPopover from "./unassigned-players-popover/unassigned-players-popover";

const ScheduleActionBar = () => {
  const players = usePlayers();
  const trainingBlocks = useTrainingBlocks();

  const { assignPlayersToTrainingBlocks } = usePlayersActions();
  const { createSchedule } = useScheduleActions();

  const handleClearSchedule = () => {
    const assignments: Record<Player["id"], Player["trainingBlockId"]> = {};
    players.forEach((player) => (assignments[player.id] = null));
    assignPlayersToTrainingBlocks(assignments);
  };

  const handleAssignPlayers = () => {
    if (trainingBlocks.length === 0) {
      toast.error("Failed to create schedule", {
        description: "Please make sure field availabilities have been set.",
      });

      return;
    }
    const assignments = createSchedule(players);

    if (Object.values(assignments).some((value) => value === null)) {
      toast.warning("Some players could not be scheduled", {
        description: "Please double check player availability and schedule settings",
      });
    }

    assignPlayersToTrainingBlocks(assignments);

    toast.success("Successfully created training schedule");
  };

  const hasAssignedPlayers = players.filter((player) => player.trainingBlockId !== null);

  return (
    <div className="w-full flex flex-wrap justify-start items-center gap-2">
      <Button onClick={handleAssignPlayers}>
        <CalendarIcon />
        Create Schedule
      </Button>
      <CreateTrainingBlockDialog />
      <ScheduleSheet />
      {hasAssignedPlayers && (
        <>
          <UnassignedPlayersPopover />
          <Button variant="destructive" onClick={handleClearSchedule}>
            <CalendarOff />
            Clear Schedule
          </Button>
        </>
      )}
    </div>
  );
};

export default ScheduleActionBar;
