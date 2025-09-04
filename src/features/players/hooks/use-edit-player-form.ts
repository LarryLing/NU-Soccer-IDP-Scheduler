import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  useForm,
  type SubmitHandler,
  type UseFieldArrayReturn,
  type UseFormReturn,
} from "react-hook-form";
import { type PlayerFormType, PlayerFormSchema } from "../schemas/player.schema";
import { transformAvailabilities, findOverlap, formatTimeWithPeriod, formatTime, parseTime } from "@/lib/utils";
import type { Day } from "@/constants/days";
import { toast } from "sonner";
import type { Player } from "@/types/player.type";
import usePlayersStore from "./use-players-store";
import { GOALKEEPER } from "@/constants/positions";

export type UseEditPlayerFormReturn = {
  form: UseFormReturn<PlayerFormType>;
  fieldArray: UseFieldArrayReturn<PlayerFormType, "availabilities", "id">;
  addAvailability: (day: Day) => void;
  onSubmit: SubmitHandler<PlayerFormType>;
};

export const useEditPlayerForm = (player?: Player): UseEditPlayerFormReturn => {
  const updatePlayer = usePlayersStore((state) => state.updatePlayer);

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

    const endInt = parseTime(lastField.end);
    const nextStartInt = Math.min(endInt + 60, 1439);
    const nextEndInt = Math.min(endInt + 120, 1439);

    append({
      day,
      start: formatTime(nextStartInt),
      end: formatTime(nextEndInt),
    });
  };

  const onSubmit: SubmitHandler<PlayerFormType> = (data: PlayerFormType) => {
    if (!player) return;

    const transformedAvailabilities = transformAvailabilities(data.availabilities);

    const overlap = findOverlap(transformedAvailabilities);
    if (overlap) {
      const formattedPreviousStartInt = formatTimeWithPeriod(overlap.previous.start_int);
      const formattedPreviousEndInt = formatTimeWithPeriod(overlap.previous.end_int);
      const formattedCurrentStartInt = formatTimeWithPeriod(overlap.current.start_int);
      const formattedCurrentEndInt = formatTimeWithPeriod(overlap.current.end_int);

      toast.error(
        `Time overlap detected on ${overlap.day}: ${formattedPreviousStartInt} - ${formattedPreviousEndInt} overlaps with ${formattedCurrentStartInt} - ${formattedCurrentEndInt}`
      );

      return;
    }

    updatePlayer({
      id: player.id,
      training_block_id: player.training_block_id,
      name: data.name,
      number: data.number,
      position: data.position,
      availabilities: transformedAvailabilities,
    });
  };

  return {
    form,
    fieldArray,
    addAvailability,
    onSubmit,
  };
};
