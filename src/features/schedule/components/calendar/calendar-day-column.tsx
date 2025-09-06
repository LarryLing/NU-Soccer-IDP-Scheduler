import { memo, useMemo, type JSX } from "react";

import type { Day } from "@/constants/days";
import { CALENDAR_TIMES } from "@/features/schedule/constants/calendar-times";
import { getDayAbbreviation } from "@/lib/time";

import useTrainingBlocksStore from "../../hooks/use-training-blocks-store";

import CalendarCell from "./calendar-cell";
import CalendarTrainingBlockPopover from "./calendar-training-block-popover";

type CalendarDayColumnProps = {
  day: Day;
};

const CalendarDayColumn = ({ day }: CalendarDayColumnProps) => {
  const trainingBlocks = useTrainingBlocksStore((state) => state.trainingBlocks);

  const cells = useMemo(() => {
    const timesEntries = Object.entries(CALENDAR_TIMES);

    return timesEntries.map((currentEntry, index) => {
      if (index === timesEntries.length - 1) return;

      const nextEntry = timesEntries[index + 1];
      if (!nextEntry) return;

      const filteredTrainingBlocks = trainingBlocks.filter(
        (trainingBlock) =>
          trainingBlock.day === day && trainingBlock.start >= currentEntry[1] && trainingBlock.start < nextEntry[1]
      );

      const children: JSX.Element[] = filteredTrainingBlocks.map((filteredTrainingBlock) => (
        <CalendarTrainingBlockPopover
          key={filteredTrainingBlock.id}
          currentCellStartInt={currentEntry[1]}
          {...filteredTrainingBlock}
        />
      ));

      return <CalendarCell key={`${day}.${currentEntry[0]}.${nextEntry[0]}`}>{children}</CalendarCell>;
    });
  }, [day, trainingBlocks]);

  const dayAbbreviation = getDayAbbreviation(day);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center border-b border-dashed h-full text-sm">{dayAbbreviation}</div>
      {cells}
    </div>
  );
};

export default memo(CalendarDayColumn);
