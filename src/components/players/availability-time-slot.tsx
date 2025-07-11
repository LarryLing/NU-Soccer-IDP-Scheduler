import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { memo } from "react";
import { usePlayerSheet } from "@/hooks/usePlayerSheet";

type AvailabilityTimeSlotProps = {
  originalIndex: number;
};

const AvailabilityTimeSlot = memo(function AvailabilityTimeSlot({
  originalIndex,
}: AvailabilityTimeSlotProps) {
  const {
    form: { control },
    fieldArray: { remove },
  } = usePlayerSheet();

  const handleRemove = () => {
    remove(originalIndex);
  };

  return (
    <div className="flex items-center gap-2">
      <FormField
        control={control}
        name={`availabilities.${originalIndex}.start` as const}
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
        name={`availabilities.${originalIndex}.end` as const}
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
