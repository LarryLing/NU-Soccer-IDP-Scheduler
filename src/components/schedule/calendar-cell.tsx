import type { PropsWithChildren } from "react";

export default function CalendarCell({ children }: PropsWithChildren) {
  return <div className="relative h-full border-b border-dashed">{children}</div>;
}
