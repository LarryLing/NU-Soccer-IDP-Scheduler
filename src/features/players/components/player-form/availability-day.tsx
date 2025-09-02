import type { PlayerFormType } from "../../schemas/player.schema";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import type { Control, FieldArrayWithId, UseFieldArrayRemove } from "react-hook-form";
import AvailabilityTimeSlot from "./availability-time-slot";
import type { Day } from "@/constants/days";
import type { UsePlayerFormReturn } from "../../hooks/use-player-form";

type AvailabilityDayProps = {
  day: Day;
  dayFields: (FieldArrayWithId<PlayerFormType, "availabilities", "id"> & {
    originalIndex: number;
  })[];
  addAvailability: UsePlayerFormReturn["addAvailability"];
  remove: UseFieldArrayRemove;
  control: Control<PlayerFormType>;
};

const AvailabilityDay = ({ day, dayFields, addAvailability, remove, control }: AvailabilityDayProps) => {
  const handleAddAvailability = () => {
    addAvailability(day);
  };

  return (
    <div className="grid gap-2">
      <Label>{day}</Label>
      <div className="flex flex-col justify-center gap-2 text-sm border py-2 px-3 min-h-[54px]">
        {dayFields.length === 0 ? (
          <i className="text-sm text-muted-foreground">No availabilities</i>
        ) : (
          dayFields.map((field) => (
            <AvailabilityTimeSlot
              key={field.id}
              originalIndex={field.originalIndex}
              remove={remove}
              control={control}
            />
          ))
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleAddAvailability}>
        <PlusIcon />
        Add Availability
      </Button>
    </div>
  );
};

export default AvailabilityDay;
