import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { memo } from "react";
import type { Control, UseFieldArrayRemove } from "react-hook-form";
import type { ScheduleSheetForm } from "@/lib/types";

type AvailabilityTimeSlotProps = {
  originalIndex: number;
  remove: UseFieldArrayRemove;
  control: Control<ScheduleSheetForm>;
};

const AvailabilityTimeSlot = memo(function AvailabilityTimeSlot({
  originalIndex,
  remove,
  control,
}: AvailabilityTimeSlotProps) {
  const handleRemove = () => {
    remove(originalIndex);
  };

  return (
    <div className="flex items-center gap-2">
      <FormField
        control={control}
        name={`fieldAvailabilities.${originalIndex}.start` as const}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <span className="text-sm">-</span>
      <FormField
        control={control}
        name={`fieldAvailabilities.${originalIndex}.end` as const}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" variant="outline" onClick={handleRemove}>
        Remove
      </Button>
    </div>
  );
});

export default AvailabilityTimeSlot;
