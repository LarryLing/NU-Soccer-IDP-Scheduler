import { TIMES } from "@/lib/constants";

export default function CalendarTimesColumn() {
  const timesKeys = Object.keys(TIMES);
  return (
    <div className="flex flex-col h-full pr-2">
      {timesKeys.map((time) => (
        <div key={time} className="relative text-sm h-full">
          <p className="absolute bottom-0 m-0 w-full text-right translate-y-1/2">{time}</p>
        </div>
      ))}
    </div>
  );
}
