import { Button } from "@/components/ui/button";
import { getTimeStringWithMeridian } from "@/lib/time";
import type { TrainingBlock } from "@/schemas/training-block.schema";

type TrainingBlockTriggerProps = {
  currentCellStartInt: number;
  handleOpenTrainingBlockDialog: () => void;
} & Pick<TrainingBlock, "day" | "start" | "end">;

const TrainingBlockTrigger = ({
  currentCellStartInt,
  handleOpenTrainingBlockDialog,
  day,
  start,
  end,
}: TrainingBlockTriggerProps) => {
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

export default TrainingBlockTrigger;
