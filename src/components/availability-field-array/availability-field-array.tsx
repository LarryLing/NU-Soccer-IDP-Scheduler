import { PlusIcon } from "lucide-react";
import type { Control, FieldArrayWithId, UseFieldArrayRemove } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Day } from "@/constants/days";
import type { UsePlayerFormReturn } from "@/features/players/hooks/use-player-form";
import type { PlayerForm } from "@/features/players/schemas/player-form.schema";
import type { ScheduleSettingsForm } from "@/features/schedule/schemas/schedule-settings-form.schema";

import AvailabilityField from "./availability-field";

type AvailabilityFieldArrayProps = {
  day: Day;
  dayFields: (FieldArrayWithId<PlayerForm | ScheduleSettingsForm, "availabilities", "id"> & {
    originalIndex: number;
  })[];
  addAvailability: UsePlayerFormReturn["addAvailability"] | UsePlayerFormReturn["addAvailability"];
  remove: UseFieldArrayRemove;
  control: Control<PlayerForm> | Control<ScheduleSettingsForm>;
  disabled: boolean;
};

const AvailabilityFieldArray = ({
  day,
  dayFields,
  addAvailability,
  remove,
  control,
  disabled,
}: AvailabilityFieldArrayProps) => {
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
            <AvailabilityField
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
        Add Availability
      </Button>
    </div>
  );
};

export default AvailabilityFieldArray;
