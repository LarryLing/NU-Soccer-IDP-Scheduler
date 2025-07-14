import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "../ui/badge";
import { formatTimeWithPeriod } from "@/lib/utils";
import type { Days, Availability } from "@/lib/types";

type AvailabilityHoverCardProps = {
  day: Days;
  availabilities: Availability[];
};

export default function AvailabilityHoverCard({ day, availabilities }: AvailabilityHoverCardProps) {
  const dayAvailabilities = availabilities.filter((availability) => availability.day === day);

  if (dayAvailabilities.length === 0) return null;

  if (dayAvailabilities.length === 1) {
    return (
      <Badge variant="secondary" className="mr-2">
        {day} {formatTimeWithPeriod(dayAvailabilities[0]!.start_int)} -{" "}
        {formatTimeWithPeriod(dayAvailabilities[0]!.end_int)}
      </Badge>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Badge variant="secondary" className="mr-2">
          {day} ({dayAvailabilities.length})
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="p-2 w-auto">
        {dayAvailabilities.map((dayAvailability, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            {formatTimeWithPeriod(dayAvailability.start_int)} -{" "}
            {formatTimeWithPeriod(dayAvailability.end_int)}
          </p>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
}
