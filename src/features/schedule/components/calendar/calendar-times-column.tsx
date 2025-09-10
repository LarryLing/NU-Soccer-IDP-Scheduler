import { CALENDAR_TIMES } from "@/features/schedule/constants/calendar-times";

const CalendarTimesColumn = () => {
  const timesKeys = Object.keys(CALENDAR_TIMES);

  return (
    <div className="flex flex-col h-full pr-2">
      {timesKeys.map((timeKey, index) => (
        <div key={timeKey} className={`relative text-sm ${index === 0 ? "h-1/2" : "h-full"}`}>
          <p className="absolute bottom-0 m-0 w-full text-right translate-y-1/2">{timeKey}</p>
        </div>
      ))}
    </div>
  );
};

export default CalendarTimesColumn;
