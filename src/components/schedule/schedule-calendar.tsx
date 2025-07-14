import { DAYS } from "@/lib/constants";
import ScheduleCalendarDayColumn from "./schedule-calendar-day-column";
import ScheduleCalendaryTimesColumn from "./schedule-calendary-times-column";

export default function TrainingBlockCalendar() {
  return (
    <div className="grid [grid-template-columns:50px_repeat(5,1fr)] border p-4 h-[600px]">
      <ScheduleCalendaryTimesColumn />
      {DAYS.map((day) => (
        <ScheduleCalendarDayColumn key={day} day={day} />
      ))}
    </div>
  );
}
