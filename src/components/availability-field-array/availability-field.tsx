import type { Control, UseFieldArrayRemove } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { PlayerForm } from "@/features/players/schemas/player-form.schema";
import type { ScheduleSettingsForm } from "@/features/schedule/schemas/schedule-settings-form.schema";

type AvailabilityFieldProps = {
  originalIndex: number;
  remove: UseFieldArrayRemove;
  control: Control<PlayerForm> | Control<ScheduleSettingsForm>;
  disabled: boolean;
};

const AvailabilityField = ({ originalIndex, remove, control, disabled }: AvailabilityFieldProps) => {
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

export default AvailabilityField;
