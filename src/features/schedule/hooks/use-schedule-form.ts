import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  useForm,
  type SubmitHandler,
  type UseFieldArrayReturn,
  type UseFormReturn,
} from "react-hook-form";
import { type ScheduleFormType, ScheduleFormSchema } from "../schemas/schedule.schema";
import type { Day } from "@/constants/days";
import { useCallback } from "react";
import { toast } from "sonner";
import { calculateMinutesFromTimeString, getTimeStringWithoutMeridian } from "@/lib/time";

export type UseScheduleFormReturn = {
  form: UseFormReturn<ScheduleFormType>;
  fieldArray: UseFieldArrayReturn<ScheduleFormType, "fieldAvailabilities", "id">;
  addFieldAvailability: (day: Day) => void;
  onSubmit: SubmitHandler<ScheduleFormType>;
};

export const useScheduleForm = (): UseScheduleFormReturn => {
  const form = useForm<ScheduleFormType>({
    resolver: zodResolver(ScheduleFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      duration: 30,
      maximumPlayerCount: 4,
      fieldAvailabilities: [],
    },
  });

  const { control } = form;

  const fieldArray = useFieldArray({
    control,
    name: "fieldAvailabilities",
  });

  const { fields, append } = fieldArray;

  const addFieldAvailability = useCallback(
    (day: Day) => {
      const dayFields = fields.filter((field) => field.day === day);
      const lastField = dayFields[dayFields.length - 1];

      if (!lastField) {
        append({
          day,
          start: "08:00",
          end: "09:00",
        });
        return;
      }

      const endInt = calculateMinutesFromTimeString(lastField.end);
      const nextStartInt = Math.min(endInt + 60, 1439);
      const nextEndInt = Math.min(endInt + 120, 1439);

      append({
        day,
        start: getTimeStringWithoutMeridian(nextStartInt),
        end: getTimeStringWithoutMeridian(nextEndInt),
      });
    },
    [fields, append]
  );

  const onSubmit: SubmitHandler<ScheduleFormType> = async (data) => {
    console.log(data);
    toast.error("Not implemented");
    return;
    // if (data.fieldAvailabilities.length === 0) {
    //   setIsScheduleSheetOpen(false);
    //   return;
    // }

    // try {
    //   setIsCreatingSchedule(true);

    //   const transformedAvailabilities = transformAvailabilities(data.fieldAvailabilities);

    //   const overlap = findOverlap(transformedAvailabilities);
    //   if (overlap) {
    //     const formattedPreviousStartInt = getTimeStringWithMeridian(overlap.previous.start_int);
    //     const formattedPreviousEndInt = getTimeStringWithMeridian(overlap.previous.end_int);
    //     const formattedCurrentStartInt = getTimeStringWithMeridian(overlap.current.start_int);
    //     const formattedCurrentEndInt = getTimeStringWithMeridian(overlap.current.end_int);
    //     setError(
    //       `Time overlap detected on ${overlap.day}: ${formattedPreviousStartInt} - ${formattedPreviousEndInt} overlaps with ${formattedCurrentStartInt} - ${formattedCurrentEndInt}`
    //     );
    //     return;
    //   }

    //   const allTrainingBlocks = createAllTrainingBlocks(transformedAvailabilities, data.duration);

    //   const { unassignedPlayerNames, playerAssignmentsMap, usedTrainingBlocks } = assignPlayers(
    //     players,
    //     allTrainingBlocks,
    //     data.maximumPlayerCount
    //   );

    //   await saveUsedTrainingBlocks(usedTrainingBlocks);
    //   await saveAssignedPlayers(playerAssignmentsMap);

    //   setUnassignedPlayerNames(unassignedPlayerNames);
    //   setIsScheduleSheetOpen(false);
    // } catch {
    //   setError("Something went wrong when creating the schedule. Please try again.");
    // } finally {
    //   setIsCreatingSchedule(false);
    // }
  };

  return {
    form,
    fieldArray,
    addFieldAvailability,
    onSubmit,
  };
};
