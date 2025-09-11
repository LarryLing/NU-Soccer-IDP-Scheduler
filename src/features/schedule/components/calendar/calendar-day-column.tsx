import { memo, useMemo, type JSX } from "react";

import type { Day } from "@/constants/days";
import { CALENDAR_TIMES } from "@/features/schedule/constants/calendar-times";
import { getDayAbbreviation } from "@/lib/time";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { useTrainingBlocks } from "../../hooks/use-schedule-store";
import TrainingBlockTrigger from "../training-block-dialog/edit-training-block-trigger";

import CalendarCell from "./calendar-cell";

type CalendarDayColumnProps = {
  day: Day;
  openTrainingBlockDialog: (trainingBlockId: TrainingBlock["id"]) => void;
};

const CalendarDayColumn = ({ day, openTrainingBlockDialog }: CalendarDayColumnProps) => {
  const trainingBlocks = useTrainingBlocks();

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
        <TrainingBlockTrigger
          key={filteredTrainingBlock.id}
          currentCellStartInt={currentEntry[1]}
          openTrainingBlockDialog={openTrainingBlockDialog}
          {...filteredTrainingBlock}
        />
      ));

      return <CalendarCell key={`${day}.${currentEntry[0]}.${nextEntry[0]}`}>{children}</CalendarCell>;
    });
  }, [day, openTrainingBlockDialog, trainingBlocks]);

  const dayAbbreviation = getDayAbbreviation(day);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center border-b border-dashed h-1/2 text-sm">{dayAbbreviation}</div>
      {cells}
    </div>
  );
};

export default memo(CalendarDayColumn);
