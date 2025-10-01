import type { Control, UseFieldArrayRemove, FieldValues, Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type AvailabilityFieldProps<T extends FieldValues> = {
  originalIndex: number;
  remove: UseFieldArrayRemove;
  control: Control<T>;
  disabled: boolean;
};

const AvailabilityField = <T extends FieldValues>({
  originalIndex,
  remove,
  control,
  disabled,
}: AvailabilityFieldProps<T>) => {
  const handleRemove = () => {
    remove(originalIndex);
  };

  return (
    <div className="flex items-center gap-2">
      <FormField
        control={control}
        name={`availabilities.${originalIndex}.start` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="time" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <span className="text-sm">-</span>
      <FormField
        control={control}
        name={`availabilities.${originalIndex}.end` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="time" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" variant="outline" onClick={handleRemove} disabled={disabled}>
        Remove
      </Button>
    </div>
  );
};

export default AvailabilityField;
