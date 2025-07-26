import type { Day, ScheduleSheetForm, UseScheduleSheetReturn } from "@/lib/types";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import type { Control, FieldArrayWithId, UseFieldArrayRemove } from "react-hook-form";
import FieldAvailabilityTimeSlot from "./field-availability-time-slot";

type AvailabilityDayProps = {
  day: Day;
  dayFields: (FieldArrayWithId<ScheduleSheetForm, "fieldAvailabilities", "id"> & {
    originalIndex: number;
  })[];
  addFieldAvailability: UseScheduleSheetReturn["addFieldAvailability"];
  remove: UseFieldArrayRemove;
  control: Control<ScheduleSheetForm>;
};

export default function FieldAvailabilityDay({
  day,
  dayFields,
  addFieldAvailability,
  remove,
  control,
}: AvailabilityDayProps) {
  const handleAddFieldAvailability = () => {
    addFieldAvailability(day);
  };

  return (
    <div className="grid gap-2">
      <Label>{day}</Label>
      <div className="flex flex-col justify-center gap-2 text-sm border py-2 px-3 min-h-[54px]">
        {dayFields.length === 0 ? (
          <i className="text-sm text-muted-foreground">No field availabilities</i>
        ) : (
          dayFields.map((field) => (
            <FieldAvailabilityTimeSlot
              key={field.id}
              originalIndex={field.originalIndex}
              remove={remove}
              control={control}
            />
          ))
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleAddFieldAvailability}>
        <PlusIcon />
        Add Field Availability
      </Button>
    </div>
  );
}
