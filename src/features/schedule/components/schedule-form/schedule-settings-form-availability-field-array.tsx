import { PlusIcon } from "lucide-react";
import type { Control, FieldArrayWithId, UseFieldArrayRemove } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Day } from "@/constants/days";

import type { UseScheduleSettingsFormReturn } from "../../hooks/use-schedule-settings-form";
import type { ScheduleSettingsForm } from "../../schemas/schedule-settings-form.schema copy";

import ScheduleSettingsFormAvailabilityField from "./schedule-settings-form-availability-field";

type ScheduleSettingsFormAvailabilityFieldArrayProps = {
  day: Day;
  dayFields: (FieldArrayWithId<ScheduleSettingsForm, "availabilities", "id"> & {
    originalIndex: number;
  })[];
  addAvailability: UseScheduleSettingsFormReturn["addAvailability"];
  remove: UseFieldArrayRemove;
  control: Control<ScheduleSettingsForm>;
  disabled: boolean;
};

const ScheduleSettingsFormAvailabilityFieldArray = ({
  day,
  dayFields,
  addAvailability,
  remove,
  control,
  disabled,
}: ScheduleSettingsFormAvailabilityFieldArrayProps) => {
  const handleAddAvailability = () => {
    addAvailability(day);
  };

  return (
    <div className="grid gap-2">
      <Label>{day}</Label>
      <div className="flex flex-col justify-center gap-2 text-sm border py-2 px-3 min-h-[54px]">
        {dayFields.length === 0 ? (
          <i className="text-sm text-muted-foreground">No field availabilities</i>
        ) : (
          dayFields.map((field) => (
            <ScheduleSettingsFormAvailabilityField
              key={field.id}
              originalIndex={field.originalIndex}
              remove={remove}
              control={control}
              disabled={disabled}
            />
          ))
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleAddAvailability} disabled={disabled}>
        <PlusIcon />
        Add Field Availability
      </Button>
    </div>
  );
};

export default ScheduleSettingsFormAvailabilityFieldArray;
