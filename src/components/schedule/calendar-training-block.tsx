import { useAssignedPlayers } from "@/hooks/useAssignedPlayers";
import type { TrainingBlock, UseTrainingBlockDialogReturn } from "@/lib/types";

type CalendarTrainingBlockProps = {
  currentCellStartInt: number;
  openTrainingBlockDialog: UseTrainingBlockDialogReturn["openTrainingBlockDialog"];
} & Pick<TrainingBlock, "id" | "day" | "start_int" | "end_int">;

export default function CalendarTrainingBlock({
  currentCellStartInt,
  openTrainingBlockDialog,
  id,
  day,
  start_int,
  end_int,
}: CalendarTrainingBlockProps) {
  const { assignedPlayerNames } = useAssignedPlayers(id);

  const handleOpenTrainingBlockDialog = () => {
    openTrainingBlockDialog(day, start_int, end_int, assignedPlayerNames);
  };

  const topPercentage = ((start_int - currentCellStartInt) / 60) * 100;
  const heightPercentage = ((end_int - start_int) / 60) * 100;

  return (
    <div
      className={`absolute top-[${topPercentage}%] border overflow-hidden flex items-center px-3`}
      style={{
        width: `calc(100% - 2px)`,
        height: `calc(${heightPercentage}% - 2px)`,
      }}
      onClick={handleOpenTrainingBlockDialog}
    >
      {assignedPlayerNames.length === 0 ? (
        <i className="text-xs text-muted-foreground">No players assigned</i>
      ) : (
        <p className="text-xs text-nowrap truncate">{assignedPlayerNames.join(", ")}</p>
      )}
    </div>
  );
}
