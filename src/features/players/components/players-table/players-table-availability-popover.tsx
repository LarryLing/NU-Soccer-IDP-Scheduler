import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Day } from "@/constants/days";
import { getTimeStringWithMeridian } from "@/lib/time";
import type { Availability } from "@/types/availability.type";

type PlayersTableAvailabilityPopoverProps = {
  day: Day;
  dayAvailabilities: Availability[];
};

const PlayersTableAvailabilityPopover = ({ day, dayAvailabilities }: PlayersTableAvailabilityPopoverProps) => {
  const formattedDayAvailabilities = dayAvailabilities.map(
    (dayAvailability) =>
      `${getTimeStringWithMeridian(dayAvailability.start_int)} - ${getTimeStringWithMeridian(dayAvailability.end_int)}`
  );

  if (formattedDayAvailabilities.length === 1) {
    return (
      <Badge variant="secondary" className="mr-2">
        {day} {formattedDayAvailabilities[0]}
      </Badge>
    );
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Badge variant="secondary" className="mr-2">
          {day} ({dayAvailabilities.length})
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-auto space-y-1">
        {formattedDayAvailabilities.map((formattedDayAvailability, index) => (
          <p key={`${day}.${formattedDayAvailability}.${index}`} className="text-sm text-muted-foreground">
            {formattedDayAvailability}
          </p>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default PlayersTableAvailabilityPopover;
