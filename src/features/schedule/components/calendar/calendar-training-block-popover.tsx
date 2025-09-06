import { Calendar, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import usePlayersStore from "@/features/players/hooks/use-players-store";
import { getTimeStringWithMeridian } from "@/lib/time";
import type { TrainingBlock } from "@/types/training-block.type";

type CalendarTrainingBlockPopoverProps = {
  currentCellStartInt: number;
} & Pick<TrainingBlock, "id" | "day" | "start" | "end">;

const CalendarTrainingBlockPopover = ({
  currentCellStartInt,
  id,
  day,
  start,
  end,
}: CalendarTrainingBlockPopoverProps) => {
  const players = usePlayersStore((state) => state.players);

  const assignedPlayers = players.filter((player) => player.trainingBlockId === id).map((player) => player.name);

  const topPercentage = ((start - currentCellStartInt) / 60) * 100;
  const heightPercentage = ((end - start) / 60) * 100;

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
          <p className="text-sm text-nowrap truncate">{assignedPlayers.join(", ")}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <div className="space-y-2">
          <h4 className="leading-none font-medium flex items-center gap-1">
            <Calendar className="size-4" /> {day}
          </h4>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <Clock className="size-4" />
            {getTimeStringWithMeridian(start)} - {getTimeStringWithMeridian(end)}
          </p>
        </div>
        <p className="text-sm">{assignedPlayers.join(", ")}</p>
      </PopoverContent>
    </Popover>
  );
};

export default CalendarTrainingBlockPopover;
