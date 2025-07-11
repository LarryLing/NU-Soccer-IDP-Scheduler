import type { Control, UseFieldArrayRemove } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import type { PlayerFormSchema } from "@/lib/schemas";
import type z from "zod";

type FormSchema = z.infer<typeof PlayerFormSchema>;

type AvailabilityTimeSlotProps = {
  originalIndex: number;
  remove: UseFieldArrayRemove;
  control: Control<FormSchema>;
};

export default function AvailabilityTimeSlot({
  remove,
  originalIndex,
  control,
}: AvailabilityTimeSlotProps) {
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
      <Button
        type="button"
        variant="outline"
        onClick={() => remove(originalIndex)}
      >
        Remove
      </Button>
    </div>
  );
}
