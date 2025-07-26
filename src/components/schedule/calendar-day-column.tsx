import type { Day, Player } from "@/lib/types";
import { TIMES } from "@/lib/constants";
import CalendarCell from "./calendar-cell";
import { getDayAbbreviation } from "@/lib/utils";
import { memo, useMemo, type JSX } from "react";
import CalendarTrainingBlockPopover from "./calendar-training-block-popover";
import { useTrainingBlocks } from "@/hooks/useTrainingBlocks";

type CalendarDayColumnProps = {
  day: Day;
  players: Player[];
};

const CalendarDayColumn = ({ day, players }: CalendarDayColumnProps) => {
  const { trainingBlocks } = useTrainingBlocks(day);

  const dayAbbreviation = getDayAbbreviation(day);

  const cells = useMemo(() => {
    const timesEntries = Object.entries(TIMES);

    return timesEntries.map((currentEntry, index) => {
      if (index === timesEntries.length - 1) return null;
      const nextEntry = timesEntries[index + 1];
      if (!nextEntry) return;

      const filteredTrainingBlocks = trainingBlocks.filter(
        (trainingBlock) =>
          trainingBlock.start_int >= currentEntry[1] && trainingBlock.start_int < nextEntry[1],
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

      return (
        <CalendarCell key={`${day}.${currentEntry[0]}.${nextEntry[0]}`}>{children}</CalendarCell>
      );
    });
  }, [trainingBlocks, players]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center border-b border-dashed h-full text-sm">
        {dayAbbreviation}
      </div>
      {cells}
    </div>
  );
};

export default memo(CalendarDayColumn);
