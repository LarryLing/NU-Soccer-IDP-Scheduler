import { CalendarIcon, CalendarOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import usePlayersStore from "@/features/players/hooks/use-players-store";

import useScheduleStore from "../hooks/use-schedule-store";
import { assignPlayersToTrainingBlocks } from "../lib/schedule";

import ScheduleSheet from "./schedule-form/schedule-settings-sheet";
import CreateTrainingBlockDialog from "./training-block-dialog/create-training-block-dialog";
import UnassignedPlayersPopover from "./unassigned-players-popover";

const ScheduleActionBar = () => {
  const trainingBlocks = useScheduleStore((state) => state.trainingBlocks);

  const handleClearSchedule = () => {
    const { players, setPlayers } = usePlayersStore.getState();
    const { setTrainingBlocks } = useScheduleStore.getState();

    const updatedPlayers = [...players].map((player) => {
      return {
        ...player,
        trainingBlockId: null,
      };
    });

    const updatedTrainingBlocks = [...trainingBlocks].map((trainingBlock) => {
      return {
        ...trainingBlock,
        assignedPlayerCount: 0,
      };
    });

    setPlayers(updatedPlayers);
    setTrainingBlocks(updatedTrainingBlocks);
  };

  const handleAssignPlayers = () => {
    if (trainingBlocks.length === 0) {
      toast.error("Failed to create training schedule", {
        description: "Field availability has not been set in schedule settings",
      });
      return;
    }

    const { setPlayers } = usePlayersStore.getState();
    const { setTrainingBlocks } = useScheduleStore.getState();

    const { updatedPlayers, assignedPlayerCounts } = assignPlayersToTrainingBlocks();

    const updatedTrainingBlocks = [...trainingBlocks].map((trainingBlock) => {
      return {
        ...trainingBlock,
        assignedPlayerCount: assignedPlayerCounts[trainingBlock.id] || 0,
      };
    });

    setPlayers(updatedPlayers);
    setTrainingBlocks(updatedTrainingBlocks);

    if (updatedPlayers.some((updatedPlayer) => updatedPlayer.trainingBlockId === null)) {
      toast.warning("Some players could not be scheduled", {
        description: "Please double check player availability and schedule settings",
      });
    }

    toast.success("Successfully created training schedule");
  };

  const hasAssignedPlayers = trainingBlocks.some((trainingBlock) => trainingBlock.assignedPlayerCount > 0);

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
