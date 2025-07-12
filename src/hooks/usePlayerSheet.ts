import { DEFAULT_PLAYER } from "@/lib/constants.ts";
import { PlayerFormSchema } from "@/lib/schemas.ts";
import { parseTime, formatTime } from "@/lib/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type {
  Availability,
  Days,
  Player,
  PlayerMetadata,
  PlayerSheetForm,
  UsePlayersSheetReturn,
} from "../lib/types.ts";

export const usePlayerSheet = (players: Player[]): UsePlayersSheetReturn => {
  const [playerMetadata, setPlayerMetadata] = useState<PlayerMetadata | null>(
    null,
  );
  const [isPlayerSheetOpen, setIsPlayerSheetOpen] = useState<boolean>(false);

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
      setIsPlayerSheetOpen(true);
    },
    [reset, players],
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

  return {
    playerMetadata,
    isPlayerSheetOpen,
    setIsPlayerSheetOpen,
    form,
    fieldArray,
    openPlayerSheet,
    addAvailability,
  };
};
