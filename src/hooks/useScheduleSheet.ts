import { useState, useCallback } from "react";
import type { Days, Player, ScheduleSheetForm, UseScheduleSheetReturn } from "../lib/types.ts";
import { ScheduleFormSchema } from "@/lib/schemas.ts";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formatTime,
  formatTimeWithPeriod,
  findOverlap,
  createTrainingBlocks,
  transformAvailabilities,
  assignPlayers,
} from "@/lib/utils.ts";
import { parseTime } from "@/lib/utils.ts";
import { useAuth } from "./useAuth.ts";

export const useScheduleSheet = (players: Player[]): UseScheduleSheetReturn => {
  const { user } = useAuth();

  const [isScheduleSheetOpen, setIsScheduleSheetOpen] = useState<boolean>(false);
  const [isSchedulingPlayers, setIsSchedulingPlayers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<ScheduleSheetForm>({
    resolver: zodResolver(ScheduleFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { control } = form;

  const fieldArray = useFieldArray({
    control,
    name: "fieldAvailabilities",
  });

  const { fields, append } = fieldArray;

  const openScheduleSheet = useCallback(() => {
    setError(null);
    setIsScheduleSheetOpen(true);
  }, [setError]);

  const addFieldAvailability = useCallback(
    (day: Days) => {
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

      const endInt = parseTime(lastField.end);
      const nextStartInt = Math.min(endInt + 60, 1439);
      const nextEndInt = Math.min(endInt + 120, 1439);

      append({
        day,
        start: formatTime(nextStartInt),
        end: formatTime(nextEndInt),
      });
    },
    [fields, append],
  );

  const onSubmit: SubmitHandler<ScheduleSheetForm> = async (data) => {
    if (!user) return;

    if (data.fieldAvailabilities.length === 0) {
      setIsScheduleSheetOpen(false);
      return;
    }

    try {
      setIsLoading(true);

      const transformedAvailabilities = transformAvailabilities(data.fieldAvailabilities);

      const overlap = findOverlap(transformedAvailabilities);
      if (overlap) {
        const formattedPreviousStartInt = formatTimeWithPeriod(overlap.previous.start_int);
        const formattedPreviousEndInt = formatTimeWithPeriod(overlap.previous.end_int);
        const formattedCurrentStartInt = formatTimeWithPeriod(overlap.current.start_int);
        const formattedCurrentEndInt = formatTimeWithPeriod(overlap.current.end_int);
        setError(
          `Time overlap detected on ${overlap.day}: ${formattedPreviousStartInt} - ${formattedPreviousEndInt} overlaps with ${formattedCurrentStartInt} - ${formattedCurrentEndInt}`,
        );
        return;
      }

      const createdTrainingBlocks = await createTrainingBlocks(
        user.id,
        transformedAvailabilities,
        30,
      );

      await assignPlayers(players, createdTrainingBlocks);

      setIsScheduleSheetOpen(false);
    } catch {
      setError("Something went wrong when creating the schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isScheduleSheetOpen,
    setIsScheduleSheetOpen,
    isSchedulingPlayers,
    setIsSchedulingPlayers,
    error,
    setError,
    isLoading,
    form,
    fieldArray,
    openScheduleSheet,
    addFieldAvailability,
    onSubmit,
  };
};
