import type { Player, TrainingBlock } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Clock } from "lucide-react";
import { formatTimeWithPeriod } from "@/lib/utils";

type CalendarTrainingBlockPopoverProps = {
  currentCellStartInt: number;
  assignedPlayerNames: Player["name"][];
} & Pick<TrainingBlock, "day" | "start_int" | "end_int">;

export default function CalendarTrainingBlockPopover({
  currentCellStartInt,
  assignedPlayerNames,
  day,
  start_int,
  end_int,
}: CalendarTrainingBlockPopoverProps) {
  const topPercentage = ((start_int - currentCellStartInt) / 60) * 100;
  const heightPercentage = ((end_int - start_int) / 60) * 100;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`absolute top-[${topPercentage}%] border overflow-hidden flex items-center px-3`}
          style={{
            width: `calc(100% - 2px)`,
            height: `calc(${heightPercentage}% - 2px)`,
          }}
        >
          {assignedPlayerNames.length === 0 ? (
            <i className="text-sm text-muted-foreground text-nowrap truncate">
              No players assigned
            </i>
          ) : (
            <p className="text-sm text-nowrap truncate">{assignedPlayerNames.join(", ")}</p>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <div className="space-y-2">
          <h4 className="leading-none font-medium flex items-center gap-1">
            <Calendar className="size-4" /> {day}
          </h4>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <Clock className="size-4" />
            {formatTimeWithPeriod(start_int)} - {formatTimeWithPeriod(end_int)}
          </p>
        </div>
        {assignedPlayerNames.length === 0 ? (
          <i className="text-sm text-muted-foreground">No players assigned</i>
        ) : (
          <p className="text-sm">{assignedPlayerNames.join(", ")}</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
