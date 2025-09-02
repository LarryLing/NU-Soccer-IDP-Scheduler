import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { UseScheduleSheetReturn } from "@/features/schedule/hooks/use-schedule-sheet";
import ScheduleForm from "./schedule-form";

type ScheduleSheetProps = Pick<UseScheduleSheetReturn, "isScheduleSheetOpen" | "setIsScheduleSheetOpen">;

const ScheduleSheet = ({ isScheduleSheetOpen, setIsScheduleSheetOpen }: ScheduleSheetProps) => {
  return (
    <Sheet open={isScheduleSheetOpen} onOpenChange={setIsScheduleSheetOpen}>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Schedule Players</SheetTitle>
          <SheetDescription>Create a weekly schedule for the players.</SheetDescription>
        </SheetHeader>
        <ScheduleForm />
      </SheetContent>
    </Sheet>
  );
};

export default ScheduleSheet;
