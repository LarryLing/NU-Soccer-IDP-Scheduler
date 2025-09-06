import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import {
  useFieldArray,
  useForm,
  type SubmitHandler,
  type UseFieldArrayReturn,
  type UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";

import type { Day } from "@/constants/days";
import { findOverlapInAvailabilities, transformIntoAvailabilityArray } from "@/lib/availability";
import { calculateMinutesFromTimeString, getTimeStringWithMeridian, getTimeStringWithoutMeridian } from "@/lib/time";

import {
  assignPlayersToTrainingBlocks,
  generatePossibleTrainingBlocks,
  saveAssignedPlayers,
  saveUsedTrainingBlocks,
} from "../lib/schedule";
import { type ScheduleForm, ScheduleFormSchema } from "../schemas/schedule-form.schema";

import type { UseScheduleSheetReturn } from "./use-schedule-sheet";

export type UseScheduleFormReturn = {
  form: UseFormReturn<ScheduleForm>;
  fieldArray: UseFieldArrayReturn<ScheduleForm, "fieldAvailabilities", "id">;
  addFieldAvailability: (day: Day) => void;
  onSubmit: SubmitHandler<ScheduleForm>;
};

export const useScheduleForm = (
  closeScheduleSheet: UseScheduleSheetReturn["closeScheduleSheet"]
): UseScheduleFormReturn => {
  const form = useForm<ScheduleForm>({
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

  const onSubmit: SubmitHandler<ScheduleForm> = (data: ScheduleForm) => {
    const transformedAvailabilities = transformIntoAvailabilityArray(data.fieldAvailabilities);

    const overlap = findOverlapInAvailabilities(transformedAvailabilities);
    if (overlap) {
      const previousStartTimeString = getTimeStringWithMeridian(overlap.previous.start);
      const previousEndTimeString = getTimeStringWithMeridian(overlap.previous.end);
      const currentStartTimeString = getTimeStringWithMeridian(overlap.current.start);
      const currentEndTimeString = getTimeStringWithMeridian(overlap.current.end);

      toast.error("Failed to create training schedule", {
        description: `Time overlap detected on ${overlap.day}: ${previousStartTimeString} - ${previousEndTimeString} overlaps with ${currentStartTimeString} - ${currentEndTimeString}`,
      });

      return;
    }

    const possibleTrainingBlocks = generatePossibleTrainingBlocks(transformedAvailabilities, data.duration);

    const { playerAssignmentsMap, usedTrainingBlocks } = assignPlayersToTrainingBlocks(
      possibleTrainingBlocks,
      data.maximumPlayerCount
    );

    saveUsedTrainingBlocks(usedTrainingBlocks);
    saveAssignedPlayers(playerAssignmentsMap);

    toast.success("Successfully created training schedule");

    const playerAssignmentsValues = [...playerAssignmentsMap.values()];
    if (playerAssignmentsValues.some((playerAssignmentsValues) => playerAssignmentsValues === null)) {
      toast.warning("Some players could not be scheduled", {
        description: "Please double check player and field availability",
      });
    }

    closeScheduleSheet();
  };

  return {
    form,
    fieldArray,
    addFieldAvailability,
    onSubmit,
  };
};
