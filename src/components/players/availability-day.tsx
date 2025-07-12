import type { Days, PlayerSheetForm } from "@/lib/types";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import type { PlayerFormSchema } from "@/lib/schemas";
import type {
  Control,
  FieldArrayWithId,
  UseFieldArrayRemove,
} from "react-hook-form";
import type z from "zod";
import AvailabilityTimeSlot from "./availability-time-slot";

type FormSchema = z.infer<typeof PlayerFormSchema>;

type AvailabilityDayProps = {
  day: Days;
  dayFields: (FieldArrayWithId<FormSchema, "availabilities", "id"> & {
    originalIndex: number;
  })[];
  addAvailability: (day: Days) => void;
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
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddAvailability}
      >
        <PlusIcon />
        Add Availability
      </Button>
    </div>
  );
}
