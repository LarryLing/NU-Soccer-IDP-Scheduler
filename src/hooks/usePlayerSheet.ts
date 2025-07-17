import { DEFAULT_PLAYER } from "@/lib/constants.ts";
import { PlayerFormSchema } from "@/lib/schemas.ts";
import {
  parseTime,
  formatTime,
  transformAvailabilities,
  findOverlap,
  formatTimeWithPeriod,
} from "@/lib/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import type {
  Availability,
  Days,
  Player,
  PlayerMetadata,
  PlayerSheetForm,
  UsePlayersReturn,
  UsePlayersSheetReturn,
} from "../lib/types.ts";
import { useAuth } from "./useAuth";

export const usePlayerSheet = (
  players: Player[],
  insertPlayer: UsePlayersReturn["insertPlayer"],
  updatePlayer: UsePlayersReturn["updatePlayer"],
): UsePlayersSheetReturn => {
  const { user } = useAuth();

  const [playerMetadata, setPlayerMetadata] = useState<PlayerMetadata | null>(null);
  const [isPlayerSheetOpen, setIsPlayerSheetOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PlayerSheetForm>({
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
    [reset, players, setError],
  );

  const addAvailability = useCallback(
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

  const onSubmit: SubmitHandler<PlayerSheetForm> = async (data) => {
    if (!user) return;

    const transformedAvailabilities = transformAvailabilities(data.availabilities);

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

    try {
      if (!playerMetadata) {
        await insertPlayer({
          ...data,
          id: crypto.randomUUID(),
          user_id: user.id,
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
      setError("Something went wrong when adding/updating the player. Please try again.");
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
