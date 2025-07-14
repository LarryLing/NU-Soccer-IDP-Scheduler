import { DAYS } from "@/lib/constants";
import ScheduleCalendarDayColumn from "./schedule-calendar-day-column";
import ScheduleCalendarTimesColumn from "./schedule-calendar-times-column";

export default function TrainingBlockCalendar() {
  return (
    <div className="grid [grid-template-columns:50px_repeat(5,1fr)] border px-4 pb-4 h-[650px]">
      <ScheduleCalendarTimesColumn />
      {DAYS.map((day) => (
        <ScheduleCalendarDayColumn key={day} day={day} />
      ))}
    </div>
  );
}
