import { memo } from "react";

import { getTimeStringWithMeridian } from "@/lib/time";
import type { TrainingBlock } from "@/schemas/training-block.schema";

type TrainingBlockDialogSelectBlockItemProps = Pick<TrainingBlock, "day" | "start" | "end">;

const TrainingBlockDialogSelectBlockItem = ({ day, start, end }: TrainingBlockDialogSelectBlockItemProps) => {
  return (
    <div className="w-full flex flex-col items-start">
      <p className="text-sm font-medium">
        {day} • {getTimeStringWithMeridian(start)} - {getTimeStringWithMeridian(end)}
      </p>
    </div>
  );
};

export default memo(TrainingBlockDialogSelectBlockItem);
