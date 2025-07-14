import { DAYS } from "@/lib/constants";
import CalendarTimesColumn from "./calendar-times-column";
import CalendarDayColumn from "./calendar-day-column";
import { useTrainingBlockDialog } from "@/hooks/useTrainingBlockDialog";
import TrainingBlockDialog from "./training-block-dialog";

export default function Calendar() {
  const trainingBlockDialogReturn = useTrainingBlockDialog();
  const { openTrainingBlockDialog } = trainingBlockDialogReturn;

  return (
    <div className="grid [grid-template-columns:50px_repeat(5,1fr)] border px-4 pb-4 h-[800px]">
      <CalendarTimesColumn />
      {DAYS.map((day) => (
        <CalendarDayColumn key={day} day={day} openTrainingBlockDialog={openTrainingBlockDialog} />
      ))}
      <TrainingBlockDialog {...trainingBlockDialogReturn} />
    </div>
  );
}
