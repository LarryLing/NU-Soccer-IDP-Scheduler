import { useState, useCallback } from "react";
import type { Day, Player, ScheduleSheetForm } from "../../../lib/types.ts";
import { ScheduleFormSchema } from "@/lib/schemas.ts";
import {
  useFieldArray,
  useForm,
  type SubmitHandler,
  type UseFieldArrayReturn,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formatTime,
  formatTimeWithPeriod,
  findOverlap,
  transformAvailabilities,
  assignPlayers,
  createAllTrainingBlocks,
  saveUsedTrainingBlocks,
  saveAssignedPlayers,
} from "@/lib/utils.ts";
import { parseTime } from "@/lib/utils.ts";
import { DEFAULT_SCHEDULE } from "@/lib/constants.ts";

export type UseScheduleSheetReturn = {
  isScheduleSheetOpen: boolean;
  setIsScheduleSheetOpen: (isScheduleSheetOpen: boolean) => void;
  isCreatingSchedule: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  unassignedPlayerNames: Player["name"][];
  form: UseFormReturn<ScheduleSheetForm>;
  fieldArray: UseFieldArrayReturn<ScheduleSheetForm, "fieldAvailabilities", "id">;
  openScheduleSheet: () => void;
  addFieldAvailability: (day: Day) => void;
  onSubmit: SubmitHandler<ScheduleSheetForm>;
};

export const useScheduleSheet = (players: Player[]): UseScheduleSheetReturn => {
  const [isScheduleSheetOpen, setIsScheduleSheetOpen] = useState<boolean>(false);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unassignedPlayerNames, setUnassignedPlayerNames] = useState<Player["name"][]>([]);

  const form = useForm<ScheduleSheetForm>({
    resolver: zodResolver(ScheduleFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: DEFAULT_SCHEDULE,
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

      const endInt = parseTime(lastField.end);
      const nextStartInt = Math.min(endInt + 60, 1439);
      const nextEndInt = Math.min(endInt + 120, 1439);

      append({
        day,
        start: formatTime(nextStartInt),
        end: formatTime(nextEndInt),
      });
    },
    [fields, append]
  );

  const onSubmit: SubmitHandler<ScheduleSheetForm> = async (data) => {
    if (data.fieldAvailabilities.length === 0) {
      setIsScheduleSheetOpen(false);
      return;
    }

    try {
      setIsCreatingSchedule(true);

      const transformedAvailabilities = transformAvailabilities(data.fieldAvailabilities);

      const overlap = findOverlap(transformedAvailabilities);
      if (overlap) {
        const formattedPreviousStartInt = formatTimeWithPeriod(overlap.previous.start_int);
        const formattedPreviousEndInt = formatTimeWithPeriod(overlap.previous.end_int);
        const formattedCurrentStartInt = formatTimeWithPeriod(overlap.current.start_int);
        const formattedCurrentEndInt = formatTimeWithPeriod(overlap.current.end_int);
        setError(
          `Time overlap detected on ${overlap.day}: ${formattedPreviousStartInt} - ${formattedPreviousEndInt} overlaps with ${formattedCurrentStartInt} - ${formattedCurrentEndInt}`
        );
        return;
      }

      const allTrainingBlocks = createAllTrainingBlocks(transformedAvailabilities, data.duration);

      const { unassignedPlayerNames, playerAssignmentsMap, usedTrainingBlocks } = assignPlayers(
        players,
        allTrainingBlocks,
        data.maximumPlayerCount
      );

      await saveUsedTrainingBlocks(usedTrainingBlocks);
      await saveAssignedPlayers(playerAssignmentsMap);

      setUnassignedPlayerNames(unassignedPlayerNames);
      setIsScheduleSheetOpen(false);
    } catch {
      setError("Something went wrong when creating the schedule. Please try again.");
    } finally {
      setIsCreatingSchedule(false);
    }
  };

  return {
    isScheduleSheetOpen,
    setIsScheduleSheetOpen,
    isCreatingSchedule,
    error,
    setError,
    unassignedPlayerNames,
    form,
    fieldArray,
    openScheduleSheet,
    addFieldAvailability,
    onSubmit,
  };
};
