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
import {
  findOverlapInAvailabilities,
  transformIntoAvailabilityArray,
  transformIntoAvailabilityFormArray,
} from "@/lib/availability";
import { calculateMinutesFromTimeString, getTimeStringWithMeridian, getTimeStringWithoutMeridian } from "@/lib/time";

import { type ScheduleSettingsForm, ScheduleSettingsFormSchema } from "../schemas/schedule-settings-form.schema copy";

import type { UseScheduleSheetReturn } from "./use-schedule-settings-sheet";
import useScheduleStore from "./use-schedule-store";

export type UseScheduleSettingsFormReturn = {
  form: UseFormReturn<ScheduleSettingsForm>;
  fieldArray: UseFieldArrayReturn<ScheduleSettingsForm, "availabilities", "id">;
  addAvailability: (day: Day) => void;
  onSubmit: SubmitHandler<ScheduleSettingsForm>;
};

export const useScheduleSettingsForm = (
  closeScheduleSheet: UseScheduleSheetReturn["closeScheduleSheet"]
): UseScheduleSettingsFormReturn => {
  const scheduleSettings = useScheduleStore((state) => state.scheduleSettings);

  const form = useForm<ScheduleSettingsForm>({
    resolver: zodResolver(ScheduleSettingsFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      ...scheduleSettings,
      availabilities: transformIntoAvailabilityFormArray(scheduleSettings.availabilities),
    },
  });

  const { control } = form;

  const fieldArray = useFieldArray({
    control,
    name: "availabilities",
  });

  const { fields, append } = fieldArray;

  const addAvailability = useCallback(
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

  const onSubmit: SubmitHandler<ScheduleSettingsForm> = (data: ScheduleSettingsForm) => {
    const transformedAvailabilities = transformIntoAvailabilityArray(data.availabilities);

    const overlap = findOverlapInAvailabilities(transformedAvailabilities);
    if (overlap) {
      const previousStartTimeString = getTimeStringWithMeridian(overlap.previous.start);
      const previousEndTimeString = getTimeStringWithMeridian(overlap.previous.end);
      const currentStartTimeString = getTimeStringWithMeridian(overlap.current.start);
      const currentEndTimeString = getTimeStringWithMeridian(overlap.current.end);

      toast.error("Failed to save schedule settings", {
        description: `Time overlap detected on ${overlap.day}: ${previousStartTimeString} - ${previousEndTimeString} overlaps with ${currentStartTimeString} - ${currentEndTimeString}`,
      });

      return;
    }

    const { setScheduleSettings } = useScheduleStore.getState();
    setScheduleSettings({
      ...data,
      availabilities: transformedAvailabilities,
    });

    toast.success("Successfully saved schedule settings");

    closeScheduleSheet();
  };

  return {
    form,
    fieldArray,
    addAvailability,
    onSubmit,
  };
};
