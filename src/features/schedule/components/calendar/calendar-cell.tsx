import type { PropsWithChildren } from "react";

const CalendarCell = ({ children }: PropsWithChildren) => {
  return <div className="relative h-full border-b border-dashed">{children}</div>;
};

export default CalendarCell;
