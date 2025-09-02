import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { memo } from "react";
import type { Control, UseFieldArrayRemove } from "react-hook-form";
import type { PlayerFormType } from "../../schemas/player.schema";

type AvailabilityTimeSlotProps = {
  originalIndex: number;
  remove: UseFieldArrayRemove;
  control: Control<PlayerFormType>;
};

const AvailabilityTimeSlot = ({ originalIndex, remove, control }: AvailabilityTimeSlotProps) => {
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
};

export default memo(AvailabilityTimeSlot);
