import { CalendarCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { UseScheduleSheetReturn } from "@/features/schedule/hooks/use-schedule-settings-sheet";

import ScheduleForm from "./schedule-settings-form";

type ScheduleSheetProps = Pick<
  UseScheduleSheetReturn,
  "isScheduleSheetOpen" | "setIsScheduleSheetOpen" | "closeScheduleSheet"
>;

const ScheduleSheet = ({ isScheduleSheetOpen, setIsScheduleSheetOpen, closeScheduleSheet }: ScheduleSheetProps) => {
  return (
    <Sheet open={isScheduleSheetOpen} onOpenChange={setIsScheduleSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <CalendarCog />
          <span className="hidden lg:block">Edit Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Edit Schedule Settings</SheetTitle>
          <SheetDescription>Enter constraints for the training schedule</SheetDescription>
        </SheetHeader>
        <ScheduleForm closeScheduleSheet={closeScheduleSheet} />
      </SheetContent>
    </Sheet>
  );
};

export default ScheduleSheet;
