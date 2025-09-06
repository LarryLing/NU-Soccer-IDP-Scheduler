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
import {
  findOverlapInAvailabilities,
  transformIntoAvailabilityArray,
  transformIntoAvailabilityFormArray,
} from "@/lib/availability";
import { calculateMinutesFromTimeString, getTimeStringWithMeridian, getTimeStringWithoutMeridian } from "@/lib/time";
import type { Player } from "@/schemas/player.schema";

import { type PlayerForm, PlayerFormSchema } from "../schemas/player-form.schema";

import type { UsePlayerSheetReturn } from "./use-player-sheet";
import usePlayersStore from "./use-players-store";

export type UsePlayerFormReturn = {
  form: UseFormReturn<PlayerForm>;
  fieldArray: UseFieldArrayReturn<PlayerForm, "availabilities", "id">;
  addAvailability: (day: Day) => void;
  onSubmit: SubmitHandler<PlayerForm>;
};

export const usePlayerForm = (
  closePlayerSheet: UsePlayerSheetReturn["closePlayerSheet"],
  player?: Player
): UsePlayerFormReturn => {
  const form = useForm<PlayerForm>({
    resolver: zodResolver(PlayerFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: player?.name ?? "",
      number: player?.number ?? 0,
      position: player?.position ?? GOALKEEPER,
      availabilities: transformIntoAvailabilityFormArray(player?.availabilities ?? []),
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

  const onSubmit: SubmitHandler<PlayerForm> = (data: PlayerForm) => {
    const transformedAvailabilities = transformIntoAvailabilityArray(data.availabilities);

    const overlap = findOverlapInAvailabilities(transformedAvailabilities);
    if (overlap) {
      const previousStartTimeString = getTimeStringWithMeridian(overlap.previous.start);
      const previousEndTimeString = getTimeStringWithMeridian(overlap.previous.end);
      const currentStartTimeString = getTimeStringWithMeridian(overlap.current.start);
      const currentEndTimeString = getTimeStringWithMeridian(overlap.current.end);

      toast.error("Failed to save player", {
        description: `Time overlap detected on ${overlap.day}: ${previousStartTimeString} - ${previousEndTimeString} overlaps with ${currentStartTimeString} - ${currentEndTimeString}`,
      });

      return;
    }

    const { players, setPlayers } = usePlayersStore.getState();

    let updatedPlayers = [...players];
    if (player) {
      updatedPlayers = [...players].map((updatedPlayer) => {
        if (updatedPlayer.id === player.id) {
          return {
            id: player.id,
            trainingBlockId: player.trainingBlockId,
            name: data.name,
            number: data.number,
            position: data.position,
            availabilities: transformedAvailabilities,
          };
        }

        return updatedPlayer;
      });
    } else {
      updatedPlayers = [
        ...players,
        {
          id: crypto.randomUUID(),
          trainingBlockId: null,
          name: data.name,
          number: data.number,
          position: data.position,
          availabilities: transformedAvailabilities,
        },
      ];
    }

    setPlayers(updatedPlayers);

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
