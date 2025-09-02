import { DAYS } from "@/constants/days";
import CalendarTimesColumn from "./calendar-times-column";
import CalendarDayColumn from "./calendar-day-column";
import type { Player } from "@/types/player.type";
import type { TrainingBlock } from "@/types/training-block.type";

type CalendarProps = {
  players: Player[];
  trainingBlocks: TrainingBlock[];
};

const Calendar = ({ players, trainingBlocks }: CalendarProps) => {
  return (
    <div className="grid [grid-template-columns:50px_repeat(5,1fr)] border px-4 pb-4 h-[800px]">
      <CalendarTimesColumn />
      {DAYS.map((day) => (
        <CalendarDayColumn key={day} day={day} players={players} trainingBlocks={trainingBlocks} />
      ))}
    </div>
  );
};

export default Calendar;
