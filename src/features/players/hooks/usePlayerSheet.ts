import { PlayerFormSchema, type PlayerFormType } from "../schemas/player.schema.ts";
import { parseTime, formatTime, transformAvailabilities, findOverlap, formatTimeWithPeriod } from "@/lib/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import {
  useForm,
  useFieldArray,
  type SubmitHandler,
  type UseFormReturn,
  type UseFieldArrayReturn,
} from "react-hook-form";
import type { Player } from "@/types/player.type";
import type { UsePlayersReturn } from "./usePlayers";
import { DEFAULT_PLAYER } from "../constants/player-form.ts";
import type { Availability } from "@/types/availability.type.ts";
import type { Day } from "@/constants/days";

export type UsePlayersSheetReturn = {
  playerMetadata: PlayerMetadata | null;
  isPlayerSheetOpen: boolean;
  setIsPlayerSheetOpen: (isPlayerSheetOpen: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  form: UseFormReturn<PlayerFormType>;
  fieldArray: UseFieldArrayReturn<PlayerFormType, "availabilities", "id">;
  openPlayerSheet: (playerId: string | null) => void;
  addAvailability: (day: Day) => void;
  onSubmit: SubmitHandler<PlayerFormType>;
};

export const usePlayerSheet = (
  players: Player[],
  createPlayer: UsePlayersReturn["createPlayer"],
  updatePlayer: UsePlayersReturn["updatePlayer"]
): UsePlayersSheetReturn => {
  const [playerMetadata, setPlayerMetadata] = useState<PlayerMetadata | null>(null);
  const [isPlayerSheetOpen, setIsPlayerSheetOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PlayerFormType>({
    resolver: zodResolver(PlayerFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: DEFAULT_PLAYER,
  });

  const { control, reset } = form;

  const fieldArray = useFieldArray({
    control,
    name: "availabilities",
  });

  const { fields, append } = fieldArray;

  const openPlayerSheet = useCallback(
    (playerId: string | null) => {
      if (playerId) {
        const player = players.find((player) => player.id === playerId);
        if (!player) return;

        reset({
          name: player.name,
          number: player.number,
          position: player.position,
          availabilities: player.availabilities as Availability[],
        });

        setPlayerMetadata(player);
      } else {
        reset(DEFAULT_PLAYER);
        setPlayerMetadata(null);
      }

      setError(null);
      setIsPlayerSheetOpen(true);
    },
    [reset, players, setError]
  );

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

  const onSubmit: SubmitHandler<PlayerFormType> = async (data) => {
    const transformedAvailabilities = transformAvailabilities(data.availabilities);

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

    try {
      if (!playerMetadata) {
        await createPlayer({
          ...data,
          id: crypto.randomUUID(),
          training_block_id: null,
          availabilities: transformedAvailabilities,
        });
      } else {
        await updatePlayer({
          ...playerMetadata,
          ...data,
          availabilities: transformedAvailabilities,
        });
      }

      setIsPlayerSheetOpen(false);
    } catch {
      setError("Something went wrong when creating/updating the player. Please try again.");
    }
  };

  return {
    playerMetadata,
    isPlayerSheetOpen,
    setIsPlayerSheetOpen,
    error,
    setError,
    form,
    fieldArray,
    openPlayerSheet,
    addAvailability,
    onSubmit,
  };
};
