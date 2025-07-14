import type { Days, PlayerSheetForm, UsePlayersSheetReturn } from "@/lib/types";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import type { Control, FieldArrayWithId, UseFieldArrayRemove } from "react-hook-form";
import AvailabilityTimeSlot from "./availability-time-slot";

type AvailabilityDayProps = {
  day: Days;
  dayFields: (FieldArrayWithId<PlayerSheetForm, "availabilities", "id"> & {
    originalIndex: number;
  })[];
  addAvailability: UsePlayersSheetReturn["addAvailability"];
  remove: UseFieldArrayRemove;
  control: Control<PlayerSheetForm>;
};

export default function AvailabilityDay({
  day,
  dayFields,
  addAvailability,
  remove,
  control,
}: AvailabilityDayProps) {
  const handleAddAvailability = () => {
    addAvailability(day);
  };

  return (
    <div className="grid gap-2">
      <Label>{day}</Label>
      <div className="flex flex-col justify-center gap-2 text-sm border py-2 px-3 min-h-[54px]">
        {dayFields.length === 0 ? (
          <p className="text-sm text-muted-foreground">No availabilities</p>
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
}
