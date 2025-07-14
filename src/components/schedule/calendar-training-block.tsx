import { useAssignedPlayers } from "@/hooks/useAssignedPlayers";
import type { TrainingBlock } from "@/lib/types";

type CalendarTrainingBlockProps = {
  trainingBlockId: TrainingBlock["id"];
  currentCellStartInt: number;
  startInt: number;
  endInt: number;
};

export default function CalendarTrainingBlock({
  trainingBlockId,
  currentCellStartInt,
  startInt,
  endInt,
}: CalendarTrainingBlockProps) {
  const { assignedPlayerNames } = useAssignedPlayers(trainingBlockId);

  const topPercentage = ((startInt - currentCellStartInt) / 60) * 100;
  const heightPercentage = ((endInt - startInt) / 60) * 100;

  return (
    <div
      className={`absolute top-[${topPercentage}%] border overflow-hidden flex items-center px-3`}
      style={{
        width: `calc(100% - 2px)`,
        height: `calc(${heightPercentage}% - 2px)`,
      }}
    >
      {assignedPlayerNames.length === 0 ? (
        <i className="text-xs text-muted-foreground">No players assigned</i>
      ) : (
        <p className="text-xs">{assignedPlayerNames.length} players assigned</p>
      )}
    </div>
  );
}
