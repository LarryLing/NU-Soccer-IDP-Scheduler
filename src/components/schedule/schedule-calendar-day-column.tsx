import type { Days, TrainingBlock } from "@/lib/types";
import { TIMES } from "@/lib/constants";
import ScheduleCalendarCell from "./schedule-calendar-cell";
import { getDayAbbreviation } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import supabase from "@/services/supabase";
import { useEffect, useState, type JSX } from "react";
import ScheduleCalendarTrainingBlock from "./schedule-calendar-training-block";

type ScheduleCalendarDayColumnProps = {
  day: Days;
};

export default function ScheduleCalendarDayColumn({ day }: ScheduleCalendarDayColumnProps) {
  const { user } = useAuth();

  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);

  useEffect(() => {
    const fetchTrainingBlocks = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("training_blocks")
        .select("*")
        .eq("user_id", user.id)
        .eq("day", day);
      if (error || !data) {
        console.error(`Error fetching training blocks for ${day}`, error);
        return;
      }
      setTrainingBlocks(data);
    };
    fetchTrainingBlocks();
    console.log(trainingBlocks);
  }, []);

  const dayAbbreviation = getDayAbbreviation(day);

  const timesEntries = Object.entries(TIMES);

  const cells: JSX.Element[] = [];
  for (let i = 0; i < timesEntries.length - 1; i++) {
    const currentEntry = timesEntries[i];
    const nextEntry = timesEntries[i + 1];

    if (!currentEntry || !nextEntry) return;

    const filteredTrainingBlocks = trainingBlocks.filter(
      (trainingBlock) =>
        trainingBlock.start_int >= currentEntry[1] && trainingBlock.start_int < nextEntry[1],
    );

    const children: JSX.Element[] = filteredTrainingBlocks.map((filteredTrainingBlock) => {
      return (
        <ScheduleCalendarTrainingBlock
          key={filteredTrainingBlock.id}
          currentCellStartInt={currentEntry[1]}
          startInt={filteredTrainingBlock.start_int}
          endInt={filteredTrainingBlock.end_int}
        />
      );
    });

    cells.push(
      <ScheduleCalendarCell cellStartInt={currentEntry[1]} cellEndInt={nextEntry[1]}>
        {children}
      </ScheduleCalendarCell>,
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center border-b border-dashed h-full text-sm">
        {dayAbbreviation}
      </div>
      {cells}
    </div>
  );
}
