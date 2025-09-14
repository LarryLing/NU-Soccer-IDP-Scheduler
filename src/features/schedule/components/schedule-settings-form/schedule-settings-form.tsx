import AvailabilityFieldArray from "@/components/availability-field-array/availability-field-array";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetFooter, SheetClose } from "@/components/ui/sheet";
import { DAYS } from "@/constants/days";

import { useScheduleSettingsForm } from "../../hooks/use-schedule-settings-form";
import type { UseScheduleSettingsSheetReturn } from "../../hooks/use-schedule-settings-sheet";

type ScheduleSettingsFormProps = {
  closeScheduleSettingsSheet: UseScheduleSettingsSheetReturn["closeScheduleSettingsSheet"];
};

const ScheduleSettingsForm = ({ closeScheduleSettingsSheet }: ScheduleSettingsFormProps) => {
  const { form, fieldArray, addAvailability, onSubmit } = useScheduleSettingsForm(closeScheduleSettingsSheet);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { fields, remove } = fieldArray;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6 px-4 mb-4">
          {DAYS.map((day) => {
            const dayFields = fields
              .map((field, idx) => ({ ...field, originalIndex: idx }))
              .filter((field) => field.day === day);
            return (
              <AvailabilityFieldArray
                key={day}
                day={day}
                dayFields={dayFields}
                addAvailability={addAvailability}
                remove={remove}
                control={control}
                disabled={isSubmitting}
              />
            );
          })}
          <FormField
            control={control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input type="number" min={15} max={60} step={15} {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="targetPlayerCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Player Count</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SheetFooter>
          <Button type="submit" disabled={isSubmitting}>
            Save Settings
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
};

export default ScheduleSettingsForm;
