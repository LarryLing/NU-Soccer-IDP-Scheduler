import { useState, useCallback } from "react";
import type {
  Days,
  Player,
  ScheduleSheetForm,
  UseScheduleSheetReturn,
} from "../lib/types.ts";
import { ScheduleFormSchema } from "@/lib/schemas.ts";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatTime } from "@/lib/utils.ts";
import { parseTime } from "@/lib/utils.ts";

export const useScheduleSheet = (players: Player[]): UseScheduleSheetReturn => {
  const [isScheduleSheetOpen, setIsScheduleSheetOpen] =
    useState<boolean>(false);
  const [isSchedulingPlayers, setIsSchedulingPlayers] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const schedulePlayers = useCallback(() => {
    console.log(players);
    throw new Error("Not yet implemented");
  }, []);

  return {
    isScheduleSheetOpen,
    setIsScheduleSheetOpen,
    isSchedulingPlayers,
    setIsSchedulingPlayers,
    error,
    setError,
    form,
    fieldArray,
    openScheduleSheet,
    addFieldAvailability,
    schedulePlayers,
  };
};
