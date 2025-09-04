import type { PlayerFormType } from "../../schemas/player.schema";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import type { Control, FieldArrayWithId, UseFieldArrayRemove } from "react-hook-form";
import PlayerFormAvailabilityFieldProps from "./player-form-availability-field";
import type { Day } from "@/constants/days";
import type { UsePlayerFormReturn } from "../../hooks/use-player-form";

type PlayerFormAvailabilityFieldArrayProps = {
  day: Day;
  dayFields: (FieldArrayWithId<PlayerFormType, "availabilities", "id"> & {
    originalIndex: number;
  })[];
  addAvailability: UsePlayerFormReturn["addAvailability"];
  remove: UseFieldArrayRemove;
  control: Control<PlayerFormType>;
  disabled: boolean;
};

const PlayerFormAvailabilityFieldArray = ({
  day,
  dayFields,
  addAvailability,
  remove,
  control,
  disabled,
}: PlayerFormAvailabilityFieldArrayProps) => {
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
            <PlayerFormAvailabilityFieldProps
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

export default PlayerFormAvailabilityFieldArray;
