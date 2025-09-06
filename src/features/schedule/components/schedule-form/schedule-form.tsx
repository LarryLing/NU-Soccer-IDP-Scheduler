import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetFooter, SheetClose } from "@/components/ui/sheet";
import { DAYS } from "@/constants/days";

import { useScheduleForm } from "../../hooks/use-schedule-form";
import type { UseScheduleSheetReturn } from "../../hooks/use-schedule-sheet";

import ScheduleFormAvailabilityFieldArray from "./schedule-form-availability-field-array";

type ScheduleFormProps = {
  closeScheduleSheet: UseScheduleSheetReturn["closeScheduleSheet"];
};

const ScheduleForm = ({ closeScheduleSheet }: ScheduleFormProps) => {
  const { form, fieldArray, addFieldAvailability, onSubmit } = useScheduleForm(closeScheduleSheet);

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
              <ScheduleFormAvailabilityFieldArray
                key={day}
                day={day}
                dayFields={dayFields}
                addFieldAvailability={addFieldAvailability}
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
            name="maximumPlayerCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Player Count</FormLabel>
                <FormControl>
                  <Input type="number" disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SheetFooter>
          <Button type="submit" disabled={isSubmitting}>
            Schedule Players
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

export default ScheduleForm;
