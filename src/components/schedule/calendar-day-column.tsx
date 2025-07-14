import type { Days, UseTrainingBlockDialogReturn } from "@/lib/types";
import { TIMES } from "@/lib/constants";
import CalendarCell from "./calendar-cell";
import { getDayAbbreviation } from "@/lib/utils";
import React, { useMemo, type JSX } from "react";
import CalendarTrainingBlock from "./calendar-training-block";
import { useTrainingBlocks } from "@/hooks/useTrainingBlocks";

type CalendarDayColumnProps = {
  day: Days;
  openTrainingBlockDialog: UseTrainingBlockDialogReturn["openTrainingBlockDialog"];
};

const CalendarDayColumn = ({ day, openTrainingBlockDialog }: CalendarDayColumnProps) => {
  const { trainingBlocks } = useTrainingBlocks(day);

  const dayAbbreviation = getDayAbbreviation(day);

  const timesEntries = Object.entries(TIMES);

  const cells = useMemo(() => {
    return timesEntries.map((currentEntry, index) => {
      if (index === timesEntries.length - 1) return null;
      const nextEntry = timesEntries[index + 1];
      if (!nextEntry) return;

      const filteredTrainingBlocks = trainingBlocks.filter(
        (trainingBlock) =>
          trainingBlock.start_int >= currentEntry[1] && trainingBlock.start_int < nextEntry[1],
      );

      const children: JSX.Element[] = filteredTrainingBlocks.map((filteredTrainingBlock) => {
        return (
          <CalendarTrainingBlock
            key={filteredTrainingBlock.id}
            currentCellStartInt={currentEntry[1]}
            openTrainingBlockDialog={openTrainingBlockDialog}
            {...filteredTrainingBlock}
          />
        );
      });

      return (
        <CalendarCell
          key={`${day}.${currentEntry[0]}.${nextEntry[0]}`}
          cellStartInt={currentEntry[1]}
          cellEndInt={nextEntry[1]}
        >
          {children}
        </CalendarCell>
      );
    });
  }, [trainingBlocks]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center border-b border-dashed h-full text-sm">
        {dayAbbreviation}
      </div>
      {cells}
    </div>
  );
};

export default React.memo(CalendarDayColumn);
