import { DAYS } from "@/constants/days";

import CalendarDayColumn from "./calendar-day-column";
import CalendarTimesColumn from "./calendar-times-column";

const Calendar = () => {
  return (
    <div className="grid [grid-template-columns:50px_repeat(5,1fr)] border px-4 pb-4 h-[800px]">
      <CalendarTimesColumn />
      {DAYS.map((day) => (
        <CalendarDayColumn key={day} day={day} />
      ))}
    </div>
  );
};

export default Calendar;
