import { Button } from "@/components/ui/button";
import { getTimeStringWithMeridian } from "@/lib/time";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { type UseEditTrainingBlockDialogReturn } from "../../hooks/use-edit-training-block-dialog";

type EditTrainingBlockTriggerProps = {
  currentCellStartInt: number;
} & Pick<UseEditTrainingBlockDialogReturn, "openTrainingBlockDialog"> &
  Pick<TrainingBlock, "id" | "day" | "start" | "end" | "assignedPlayerCount">;

const EditTrainingBlockTrigger = ({
  currentCellStartInt,
  openTrainingBlockDialog,
  id,
  day,
  start,
  end,
  assignedPlayerCount,
}: EditTrainingBlockTriggerProps) => {
  if (assignedPlayerCount === 0) return null;

  const handleOpenTrainingBlockDialog = () => {
    openTrainingBlockDialog(id);
  };

  const topPercentage = ((start - currentCellStartInt) / 60) * 100;
  const heightPercentage = ((end - start) / 60) * 100;

  return (
    <Button
      variant="outline"
      className={`absolute border overflow-hidden flex items-center px-3`}
      style={{
        width: `calc(100% - 2px)`,
        top: `${topPercentage}%`,
        height: `calc(${heightPercentage}% - 2px)`,
      }}
      onClick={handleOpenTrainingBlockDialog}
    >
      <p className="text-sm text-nowrap truncate">
        {day} • {getTimeStringWithMeridian(start)} - {getTimeStringWithMeridian(end)}
      </p>
    </Button>
  );
};

export default EditTrainingBlockTrigger;
