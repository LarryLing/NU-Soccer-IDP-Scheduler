import type { Player } from "@/features/players/types/player.type";
import type { TrainingBlock } from "@/features/schedule/types/training-block.type";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTimeStringWithMeridian } from "@/lib/time";

type CalendarTrainingBlockPopoverProps = {
  currentCellStartInt: number;
  assignedPlayerNames: Player["name"][];
} & Pick<TrainingBlock, "day" | "start_int" | "end_int">;

const CalendarTrainingBlockPopover = ({
  currentCellStartInt,
  assignedPlayerNames,
  day,
  start_int,
  end_int,
}: CalendarTrainingBlockPopoverProps) => {
  const topPercentage = ((start_int - currentCellStartInt) / 60) * 100;
  const heightPercentage = ((end_int - start_int) / 60) * 100;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`absolute border overflow-hidden flex items-center px-3`}
          style={{
            width: `calc(100% - 2px)`,
            top: `${topPercentage}%`,
            height: `calc(${heightPercentage}% - 2px)`,
          }}
        >
          <p className="text-sm text-nowrap truncate">{assignedPlayerNames.join(", ")}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <div className="space-y-2">
          <h4 className="leading-none font-medium flex items-center gap-1">
            <Calendar className="size-4" /> {day}
          </h4>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <Clock className="size-4" />
            {getTimeStringWithMeridian(start_int)} - {getTimeStringWithMeridian(end_int)}
          </p>
        </div>
        <p className="text-sm">{assignedPlayerNames.join(", ")}</p>
      </PopoverContent>
    </Popover>
  );
};

export default CalendarTrainingBlockPopover;
