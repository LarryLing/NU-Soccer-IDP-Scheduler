import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  useForm,
  type SubmitHandler,
  type UseFieldArrayReturn,
  type UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";

import type { Day } from "@/constants/days";
import { GOALKEEPER } from "@/features/players/constants/positions";
import { findOverlapInAvailabilities, transformAndSortAvailabilities } from "@/lib/availability";
import { calculateMinutesFromTimeString, getTimeStringWithMeridian, getTimeStringWithoutMeridian } from "@/lib/time";
import type { Player } from "@/types/player.type";

import { type PlayerFormType, PlayerFormSchema } from "../schemas/player-form.schema";

import type { UsePlayerSheetReturn } from "./use-player-sheet";
import usePlayersStore from "./use-players-store";

export type UsePlayerFormReturn = {
  form: UseFormReturn<PlayerFormType>;
  fieldArray: UseFieldArrayReturn<PlayerFormType, "availabilities", "id">;
  addAvailability: (day: Day) => void;
  onSubmit: SubmitHandler<PlayerFormType>;
};

export const usePlayerForm = (
  closePlayerSheet: UsePlayerSheetReturn["closePlayerSheet"],
  player?: Player
): UsePlayerFormReturn => {
  const form = useForm<PlayerFormType>({
    resolver: zodResolver(PlayerFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: player?.name ?? "",
      number: player?.number ?? 0,
      position: player?.position ?? GOALKEEPER,
      availabilities: player?.availabilities ?? [],
    },
  });

  const { control } = form;

  const fieldArray = useFieldArray({
    control,
    name: "availabilities",
  });

  const { fields, append } = fieldArray;

  const addAvailability = (day: Day) => {
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
  };

  const onSubmit: SubmitHandler<PlayerFormType> = (data: PlayerFormType) => {
    const transformedAvailabilities = transformAndSortAvailabilities(data.availabilities);

    const overlap = findOverlapInAvailabilities(transformedAvailabilities);
    if (overlap) {
      const formattedPreviousStartInt = getTimeStringWithMeridian(overlap.previous.start_int);
      const formattedPreviousEndInt = getTimeStringWithMeridian(overlap.previous.end_int);
      const formattedCurrentStartInt = getTimeStringWithMeridian(overlap.current.start_int);
      const formattedCurrentEndInt = getTimeStringWithMeridian(overlap.current.end_int);

      toast.error("Failed to save player", {
        description: `Time overlap detected on ${overlap.day}: ${formattedPreviousStartInt} - ${formattedPreviousEndInt} overlaps with ${formattedCurrentStartInt} - ${formattedCurrentEndInt}`,
      });

      return;
    }

    if (player) {
      const updatePlayer = usePlayersStore.getState().updatePlayer;
      updatePlayer({
        id: player.id,
        training_block_id: player.training_block_id,
        name: data.name,
        number: data.number,
        position: data.position,
        availabilities: transformedAvailabilities,
      });
    } else {
      const createPlayer = usePlayersStore.getState().createPlayer;
      createPlayer({
        name: data.name,
        number: data.number,
        position: data.position,
        availabilities: transformedAvailabilities,
      });
    }

    toast.success("Successfully saved player");

    closePlayerSheet();
  };

  return {
    form,
    fieldArray,
    addAvailability,
    onSubmit,
  };
};
