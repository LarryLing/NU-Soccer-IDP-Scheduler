import type { Day } from "@/constants/days";
import type { Player } from "@/features/players/types/player.type";
import { CALENDAR_TIMES } from "@/constants/calendar-times";
import CalendarCell from "./calendar-cell";
import { memo, useMemo, type JSX } from "react";
import CalendarTrainingBlockPopover from "./calendar-training-block-popover";
import type { TrainingBlock } from "@/features/schedule/types/training-block.type";
import { getDayAbbreviation } from "@/lib/time";

type CalendarDayColumnProps = {
  day: Day;
  players: Player[];
  trainingBlocks: TrainingBlock[];
};

const CalendarDayColumn = ({ day, players, trainingBlocks }: CalendarDayColumnProps) => {
  const dayAbbreviation = getDayAbbreviation(day);

  const cells = useMemo(() => {
    const timesEntries = Object.entries(CALENDAR_TIMES);

    return timesEntries.map((currentEntry, index) => {
      if (index === timesEntries.length - 1) return null;
      const nextEntry = timesEntries[index + 1];
      if (!nextEntry) return;

      const filteredTrainingBlocks = trainingBlocks.filter(
        (trainingBlock) => trainingBlock.start_int >= currentEntry[1] && trainingBlock.start_int < nextEntry[1]
      );

      const children: JSX.Element[] = filteredTrainingBlocks.map((filteredTrainingBlock) => {
        const assignedPlayerNames = players
          .filter((player) => player.training_block_id === filteredTrainingBlock.id)
          .map((player) => player.name);

        return (
          <CalendarTrainingBlockPopover
            key={filteredTrainingBlock.id}
            currentCellStartInt={currentEntry[1]}
            assignedPlayerNames={assignedPlayerNames}
            {...filteredTrainingBlock}
          />
        );
      });

      return <CalendarCell key={`${day}.${currentEntry[0]}.${nextEntry[0]}`}>{children}</CalendarCell>;
    });
  }, [trainingBlocks, players]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center border-b border-dashed h-full text-sm">{dayAbbreviation}</div>
      {cells}
    </div>
  );
};

export default memo(CalendarDayColumn);
