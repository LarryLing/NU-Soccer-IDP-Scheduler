import type { Days } from "@/lib/types";
import { TIMES } from "@/lib/constants";

type ScheduleCalendarDayColumnProps = {
  day: Days;
};

export default function ScheduleCalendarDayColumn({ day }: ScheduleCalendarDayColumnProps) {
  let day_abbreviation;

  switch (day) {
    case "Monday":
      day_abbreviation = "Mo";
      break;
    case "Tuesday":
      day_abbreviation = "Tu";
      break;
    case "Wednesday":
      day_abbreviation = "We";
      break;
    case "Thursday":
      day_abbreviation = "Th";
      break;
    case "Friday":
      day_abbreviation = "Fr";
      break;
  }

  return (
    <div className="flex flex-col h-full">
      {TIMES.map((time, index) => {
        if (index === 0) {
          return (
            <div
              key={time}
              className="flex justify-center items-center border-b border-dashed h-full text-sm"
            >
              {day_abbreviation}
            </div>
          );
        }
        return <div key={time} className="border-b border-dashed h-full" />;
      })}
    </div>
  );
}
