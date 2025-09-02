import type { Day } from "@/constants/days";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import type { Control, FieldArrayWithId, UseFieldArrayRemove } from "react-hook-form";
import FieldAvailabilityTimeSlot from "./field-availability-time-slot";
import type { ScheduleFormType } from "../../schemas/schedule.schema";
import type { UseScheduleFormReturn } from "../../hooks/use-schedule-form";

type AvailabilityDayProps = {
  day: Day;
  dayFields: (FieldArrayWithId<ScheduleFormType, "fieldAvailabilities", "id"> & {
    originalIndex: number;
  })[];
  addFieldAvailability: UseScheduleFormReturn["addFieldAvailability"];
  remove: UseFieldArrayRemove;
  control: Control<ScheduleFormType>;
};

const FieldAvailabilityDay = ({ day, dayFields, addFieldAvailability, remove, control }: AvailabilityDayProps) => {
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
};

export default FieldAvailabilityDay;
