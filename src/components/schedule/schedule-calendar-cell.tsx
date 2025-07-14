import type { PropsWithChildren } from "react";

type ScheduleCalendarCellProps = {
  cellStartInt: number;
  cellEndInt: number;
} & PropsWithChildren;

export default function ScheduleCalendarCell({ children }: ScheduleCalendarCellProps) {
  return <div className="relative h-full border-b border-dashed text-sm">{children}</div>;
}
