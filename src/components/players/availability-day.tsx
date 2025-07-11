import type { Days } from "@/lib/types";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import type { PlayerFormSchema } from "@/lib/schemas";
import type { FieldArrayWithId } from "react-hook-form";
import type z from "zod";
import AvailabilityTimeSlot from "./availability-time-slot";
import { usePlayerSheet } from "@/hooks/usePlayerSheet";

type FormSchema = z.infer<typeof PlayerFormSchema>;

type AvailabilityDayProps = {
  day: Days;
  dayFields: (FieldArrayWithId<FormSchema, "availabilities", "id"> & {
    originalIndex: number;
  })[];
};

export default function AvailabilityDay({
  day,
  dayFields,
}: AvailabilityDayProps) {
  const { addAvailability } = usePlayerSheet();

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
