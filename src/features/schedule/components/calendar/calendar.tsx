import { useCallback } from "react";

import { DAYS } from "@/constants/days";
import usePlayersStore from "@/features/players/hooks/use-players-store";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import useScheduleStore from "../../hooks/use-schedule-store";
import useTrainingBlockDialog from "../../hooks/use-training-block-dialog";
import EditTrainingBlockDialog from "../training-block-dialog/edit-training-block-dialog";

import CalendarDayColumn from "./calendar-day-column";
import CalendarTimesColumn from "./calendar-times-column";

const Calendar = () => {
  const useTrainingBlockDialogReturn = useTrainingBlockDialog();
  const { setIsTrainingBlockDialogOpen, setSelectedTrainingBlock, setAssignedPlayers } = useTrainingBlockDialogReturn;

  const openTrainingBlockDialog = useCallback(
    (trainingBlockId: TrainingBlock["id"]) => {
      const { players } = usePlayersStore.getState();
      const { trainingBlocks } = useScheduleStore.getState();

      setSelectedTrainingBlock(trainingBlocks.find((trainingBlock) => trainingBlock.id === trainingBlockId) || null);
      setAssignedPlayers(players.filter((player) => player.trainingBlockId === trainingBlockId));
      setIsTrainingBlockDialogOpen(true);
    },
    [setAssignedPlayers, setIsTrainingBlockDialogOpen, setSelectedTrainingBlock]
  );

  return (
    <>
      <div className="grid [grid-template-columns:50px_repeat(5,1fr)] border px-2 pb-4 h-[1000px]">
        <CalendarTimesColumn />
        {DAYS.map((day) => (
          <CalendarDayColumn key={day} day={day} openTrainingBlockDialog={openTrainingBlockDialog} />
        ))}
      </div>
      <EditTrainingBlockDialog {...useTrainingBlockDialogReturn} />
    </>
  );
};

export default Calendar;
