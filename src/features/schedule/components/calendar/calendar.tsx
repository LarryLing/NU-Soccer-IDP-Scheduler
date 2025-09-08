import { DAYS } from "@/constants/days";

import useCalendarTrainingBlockDialog from "../../hooks/use-training-block-dialog";
import TrainingBlockDialog from "../training-block-dialog/training-block-dialog";

import CalendarDayColumn from "./calendar-day-column";
import CalendarTimesColumn from "./calendar-times-column";

const Calendar = () => {
  const useTrainingBlockDialogReturn = useCalendarTrainingBlockDialog();
  const { openTrainingBlockDialog } = useTrainingBlockDialogReturn;
  return (
    <>
      <div className="grid [grid-template-columns:50px_repeat(5,1fr)] border px-4 pb-4 h-[800px]">
        <CalendarTimesColumn />
        {DAYS.map((day) => (
          <CalendarDayColumn key={day} day={day} openTrainingBlockDialog={openTrainingBlockDialog} />
        ))}
      </div>
      <TrainingBlockDialog {...useTrainingBlockDialogReturn} />
    </>
  );
};

export default Calendar;
