import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import type { UseScheduleSheetReturn } from "@/lib/types";
import ErrorAlert from "../misc/error-alert";

type ScheduleSheetProps = Pick<
  UseScheduleSheetReturn,
  "isScheduleSheetOpen" | "setIsScheduleSheetOpen" | "error" | "setError"
>;

export default function ScheduleSheet({
  isScheduleSheetOpen,
  setIsScheduleSheetOpen,
  error,
}: ScheduleSheetProps) {
  return (
    <Sheet open={isScheduleSheetOpen} onOpenChange={setIsScheduleSheetOpen}>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Schedule Players</SheetTitle>
          <SheetDescription>
            Create a weekly schedule for the players.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 px-4 mb-4">
          Content
          {error && <ErrorAlert message={error} />}
        </div>
        <SheetFooter>
          <Button type="submit">Schedule Players</Button>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
