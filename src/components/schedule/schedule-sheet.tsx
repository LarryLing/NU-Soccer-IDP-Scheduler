import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Button } from "../ui/button";
import type { UseScheduleSheetReturn } from "@/lib/types";
import ErrorAlert from "../misc/error-alert";
import { DAYS } from "@/lib/constants";
import FieldAvailabilityDay from "./field-availability-day";
import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectValue } from "../ui/select";

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
              <div className="flex flex-col gap-2">
                <Label>Training Block Duration</Label>
                <Select>
                  <SelectTrigger disabled className="w-full">
                    <SelectValue placeholder="30 minutes" />
                  </SelectTrigger>
                </Select>
              </div>
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
