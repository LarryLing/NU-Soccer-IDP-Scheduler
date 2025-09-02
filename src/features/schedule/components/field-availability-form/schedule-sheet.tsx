import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { UseScheduleSheetReturn } from "@/features/schedule/hooks/useScheduleSheet";
import ErrorAlert from "@/components/misc/error-alert";
import { DAYS } from "@/constants/days";
import FieldAvailabilityDay from "./field-availability-day";
import { Input } from "@/components/ui/input";

type ScheduleSheetProps = Pick<
  UseScheduleSheetReturn,
  | "isScheduleSheetOpen"
  | "setIsScheduleSheetOpen"
  | "error"
  | "form"
  | "fieldArray"
  | "addFieldAvailability"
  | "onSubmit"
>;

export default function ScheduleSheet({
  isScheduleSheetOpen,
  setIsScheduleSheetOpen,
  error,
  form,
  fieldArray: { fields, remove },
  addFieldAvailability,
  onSubmit,
}: ScheduleSheetProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValidating },
  } = form;

  return (
    <Sheet open={isScheduleSheetOpen} onOpenChange={setIsScheduleSheetOpen}>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Schedule Players</SheetTitle>
          <SheetDescription>Create a weekly schedule for the players.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6 px-4 mb-4">
              {DAYS.map((day) => {
                const dayFields = fields
                  .map((field, idx) => ({ ...field, originalIndex: idx }))
                  .filter((field) => field.day === day);
                return (
                  <FieldAvailabilityDay
                    key={day}
                    day={day}
                    dayFields={dayFields}
                    addFieldAvailability={addFieldAvailability}
                    remove={remove}
                    control={control}
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
                      <Input type="number" min={15} max={60} step={15} disabled {...field} />
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
              {error && <ErrorAlert message={error} />}
            </div>
            <SheetFooter>
              <Button type="submit" disabled={isSubmitting || isValidating}>
                Schedule Players
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting || isValidating}>
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
