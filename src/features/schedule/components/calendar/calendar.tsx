import { DAYS } from "@/constants/days";

import useTrainingBlockDialog from "../../hooks/use-edit-training-block-dialog";
import EditTrainingBlockDialog from "../edit-training-block-dialog/edit-training-block-dialog";

import CalendarDayColumn from "./calendar-day-column";
import CalendarTimesColumn from "./calendar-times-column";

const Calendar = () => {
  const useTrainingBlockDialogReturn = useTrainingBlockDialog();
  const { openTrainingBlockDialog } = useTrainingBlockDialogReturn;

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
