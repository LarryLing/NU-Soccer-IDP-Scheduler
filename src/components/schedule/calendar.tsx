import { DAYS } from "@/lib/constants";
import CalendarTimesColumn from "./calendar-times-column";
import CalendarDayColumn from "./calendar-day-column";

export default function Calendar() {
  return (
    <div className="grid [grid-template-columns:50px_repeat(5,1fr)] border px-4 pb-4 h-[800px]">
      <CalendarTimesColumn />
      {DAYS.map((day) => (
        <CalendarDayColumn key={day} day={day} />
      ))}
    </div>
  );
}
