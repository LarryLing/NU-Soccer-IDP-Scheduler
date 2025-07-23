import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "../ui/badge";
import { formatTimeWithPeriod } from "@/lib/utils";
import type { Day, Availability } from "@/lib/types";

type AvailabilityPopoverProps = {
  day: Day;
  dayAvailabilities: Availability[];
};

export default function AvailabilityPopover({ day, dayAvailabilities }: AvailabilityPopoverProps) {
  const formattedDayAvailabilities = dayAvailabilities.map(
    (dayAvailability) =>
      `${formatTimeWithPeriod(dayAvailability.start_int)} - ${formatTimeWithPeriod(dayAvailability.end_int)}`,
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
          <p
            key={`${day}.${formattedDayAvailability}.${index}`}
            className="text-sm text-muted-foreground"
          >
            {formattedDayAvailability}
          </p>
        ))}
      </PopoverContent>
    </Popover>
  );
}
