import { CalendarCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useScheduleSettingsSheet } from "@/features/schedule/hooks/use-schedule-settings-sheet";

import ScheduleForm from "./schedule-settings-form";

const ScheduleSettingsSheet = () => {
  const { isScheduleSettingsSheetOpen, setIsScheduleSettingsSheetOpen, closeScheduleSettingsSheet } =
    useScheduleSettingsSheet();

  return (
    <Sheet open={isScheduleSettingsSheetOpen} onOpenChange={setIsScheduleSettingsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <CalendarCog />
          Edit Schedule Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Edit Schedule Settings</SheetTitle>
          <SheetDescription>
            Enter field availability, training block duration, and maximum player count.
          </SheetDescription>
        </SheetHeader>
        <ScheduleForm closeScheduleSettingsSheet={closeScheduleSettingsSheet} />
      </SheetContent>
    </Sheet>
  );
};

export default ScheduleSettingsSheet;
