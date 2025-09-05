import { createFileRoute } from "@tanstack/react-router";

import Calendar from "@/features/schedule/components/calendar/calendar";
import ScheduleActionBar from "@/features/schedule/components/schedule-action-bar";

export const Route = createFileRoute("/schedule")({
  component: Schedule,
});

function Schedule() {
  return (
    <>
      <ScheduleActionBar />
      <Calendar />
    </>
  );
}
