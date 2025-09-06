import type { Control, UseFieldArrayRemove } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { PlayerForm } from "../../schemas/player-form.schema";

type PlayerFormAvailabilityFieldProps = {
  originalIndex: number;
  remove: UseFieldArrayRemove;
  control: Control<PlayerForm>;
  disabled: boolean;
};

const PlayerFormAvailabilityField = ({
  originalIndex,
  remove,
  control,
  disabled,
}: PlayerFormAvailabilityFieldProps) => {
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
              <Input type="time" {...field} disabled={disabled} />
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

export default PlayerFormAvailabilityField;
