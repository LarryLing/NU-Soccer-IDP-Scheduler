import type { Days } from "@/lib/types";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import type { PlayerFormSchema } from "@/lib/schemas";
import type {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import type z from "zod";
import AvailabilityTimeSlot from "./availability-time-slot";
import { formatTime, parseTime } from "@/lib/utils";

type FormSchema = z.infer<typeof PlayerFormSchema>;

type AvailabilityDayProps = {
  day: Days;
  dayFields: (FieldArrayWithId<FormSchema, "availabilities", "id"> & {
    originalIndex: number;
  })[];
  append: UseFieldArrayAppend<FormSchema, "availabilities">;
  remove: UseFieldArrayRemove;
  control: Control<FormSchema>;
};

export default function AvailabilityDay({
  day,
  dayFields,
  append,
  remove,
  control,
}: AvailabilityDayProps) {
  const handleAddAvailability = () => {
    const lastField = dayFields[dayFields.length - 1];
    if (!lastField) {
      append({
        day,
        start: "08:00",
        end: "09:00",
      });
      return;
    }
    const endInt = parseTime(lastField.end);
    const nextStartInt = Math.min(endInt + 60, 1439);
    const nextEndInt = Math.min(endInt + 120, 1439);
    append({
      day,
      start: formatTime(nextStartInt),
      end: formatTime(nextEndInt),
    });
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
