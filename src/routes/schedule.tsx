import Calendar from "@/features/schedule/components/calendar/calendar";
import ScheduleSheet from "@/features/schedule/components/schedule-form/schedule-sheet";
import ScheduleActionBar from "@/features/schedule/components/schedule-action-bar";
import { useScheduleSheet } from "@/features/schedule/hooks/use-schedule-sheet";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/schedule")({
  component: Schedule,
});

function Schedule() {
  const scheduleSheetReturn = useScheduleSheet();
  const { openScheduleSheet } = scheduleSheetReturn;

  return (
    <>
      <ScheduleActionBar openScheduleSheet={openScheduleSheet} unassignedPlayerNames={[]} />
      <Calendar players={[]} trainingBlocks={[]} />
      <ScheduleSheet {...scheduleSheetReturn} />
    </>
  );
}
