import { formatTimeWithPeriod } from "@/lib/utils";

type CalendarTrainingBlockProps = {
  currentCellStartInt: number;
  startInt: number;
  endInt: number;
};

export default function CalendarTrainingBlock({
  currentCellStartInt,
  startInt,
  endInt,
}: CalendarTrainingBlockProps) {
  const topPercentage = ((startInt - currentCellStartInt) / 60) * 100;
  const heightPercentage = ((endInt - startInt) / 60) * 100;

  return (
    <div
      className={`absolute top-[${topPercentage}%] w-full h-[${heightPercentage}%] border overflow-hidden flex justify-center items-center px-2`}
    >
      <p className="text-nowrap">
        {formatTimeWithPeriod(startInt)} - {formatTimeWithPeriod(endInt)}
      </p>
    </div>
  );
}
