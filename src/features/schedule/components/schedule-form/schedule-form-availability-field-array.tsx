import { PlusIcon } from "lucide-react";
import type { Control, FieldArrayWithId, UseFieldArrayRemove } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Day } from "@/constants/days";

import type { UseScheduleFormReturn } from "../../hooks/use-schedule-form";
import type { ScheduleForm } from "../../schemas/schedule-form.schema";

import ScheduleFormAvailabilityField from "./schedule-form-availability-field";

type ScheduleFormAvailabilityFieldArrayProps = {
  day: Day;
  dayFields: (FieldArrayWithId<ScheduleForm, "fieldAvailabilities", "id"> & {
    originalIndex: number;
  })[];
  addFieldAvailability: UseScheduleFormReturn["addFieldAvailability"];
  remove: UseFieldArrayRemove;
  control: Control<ScheduleForm>;
  disabled: boolean;
};

const ScheduleFormAvailabilityFieldArray = ({
  day,
  dayFields,
  addFieldAvailability,
  remove,
  control,
  disabled,
}: ScheduleFormAvailabilityFieldArrayProps) => {
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
            <ScheduleFormAvailabilityField
              key={field.id}
              originalIndex={field.originalIndex}
              remove={remove}
              control={control}
              disabled={disabled}
            />
          ))
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleAddFieldAvailability} disabled={disabled}>
        <PlusIcon />
        Add Field Availability
      </Button>
    </div>
  );
};

export default ScheduleFormAvailabilityFieldArray;
