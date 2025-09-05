import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { UseScheduleSheetReturn } from "@/features/schedule/hooks/use-schedule-sheet";

import ScheduleForm from "./schedule-form";

type ScheduleSheetProps = Pick<
  UseScheduleSheetReturn,
  "isScheduleSheetOpen" | "setIsScheduleSheetOpen" | "closeScheduleSheet"
>;

const ScheduleSheet = ({ isScheduleSheetOpen, setIsScheduleSheetOpen, closeScheduleSheet }: ScheduleSheetProps) => {
  return (
    <Sheet open={isScheduleSheetOpen} onOpenChange={setIsScheduleSheetOpen}>
      <SheetTrigger asChild>
        <Button>
          <CalendarIcon />
          Create Schedule
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Schedule Players</SheetTitle>
          <SheetDescription>Create a weekly training schedule.</SheetDescription>
        </SheetHeader>
        <ScheduleForm closeScheduleSheet={closeScheduleSheet} />
      </SheetContent>
    </Sheet>
  );
};

export default ScheduleSheet;
