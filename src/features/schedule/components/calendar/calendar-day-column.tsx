import type { Day } from "@/constants/days";
import { CALENDAR_TIMES } from "@/constants/calendar-times";
import CalendarCell from "./calendar-cell";
import { memo, useMemo, type JSX } from "react";
import CalendarTrainingBlockPopover from "./calendar-training-block-popover";
import { getDayAbbreviation } from "@/lib/time";
import useTrainingBlocksStore from "../../hooks/use-training-blocks-store";

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
          trainingBlock.day === day &&
          trainingBlock.start_int >= currentEntry[1] &&
          trainingBlock.start_int < nextEntry[1]
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
  }, [trainingBlocks]);

  const dayAbbreviation = getDayAbbreviation(day);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center border-b border-dashed h-full text-sm">{dayAbbreviation}</div>
      {cells}
    </div>
  );
};

export default memo(CalendarDayColumn);
