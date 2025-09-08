import { getTimeStringWithMeridian } from "@/lib/time";
import type { TrainingBlock } from "@/schemas/training-block.schema";

type TrainingBlockDialogSelectItemProps = Pick<TrainingBlock, "day" | "start" | "end" | "assignedPlayerCount">;

const TrainingBlockDialogSelectItem = ({
  day,
  start,
  end,
  assignedPlayerCount,
}: TrainingBlockDialogSelectItemProps) => {
  return (
    <div className="w-full">
      <p className="text-sm font-medium">{day}</p>
      <p className="text-sm text-muted-foreground">
        {getTimeStringWithMeridian(start)} - {getTimeStringWithMeridian(end)} • {assignedPlayerCount} Players Assigned
      </p>
    </div>
  );
};

export default TrainingBlockDialogSelectItem;
