import { CalendarCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useScheduleSheet } from "@/features/schedule/hooks/use-schedule-settings-sheet";

import ScheduleForm from "./schedule-settings-form";

const ScheduleSheet = () => {
  const { isScheduleSheetOpen, setIsScheduleSheetOpen, closeScheduleSheet } = useScheduleSheet();

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
          <SheetDescription>
            Enter field availability, training block duration, and maximum player count.
          </SheetDescription>
        </SheetHeader>
        <ScheduleForm closeScheduleSheet={closeScheduleSheet} />
      </SheetContent>
    </Sheet>
  );
};

export default ScheduleSheet;
