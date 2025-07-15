import type { PropsWithChildren } from "react";

type CalendarCellProps = PropsWithChildren;

export default function CalendarCell({ children }: CalendarCellProps) {
  return <div className="relative h-full border-b border-dashed text-sm">{children}</div>;
}
