import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  useForm,
  type SubmitHandler,
  type UseFieldArrayReturn,
  type UseFormReturn,
} from "react-hook-form";
import { DEFAULT_PLAYER } from "../constants/player-form";
import { type PlayerFormType, PlayerFormSchema } from "../schemas/player.schema";
import { transformAvailabilities, findOverlap, formatTimeWithPeriod, formatTime, parseTime } from "@/lib/utils";
import type { Day } from "@/constants/days";
import { toast } from "sonner";

export type UsePlayerFormReturn = {
  form: UseFormReturn<PlayerFormType>;
  fieldArray: UseFieldArrayReturn<PlayerFormType, "availabilities", "id">;
  addAvailability: (day: Day) => void;
  onSubmit: SubmitHandler<PlayerFormType>;
};

export const usePlayerForm = (): UsePlayerFormReturn => {
  const form = useForm<PlayerFormType>({
    resolver: zodResolver(PlayerFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: DEFAULT_PLAYER,
  });

  const fieldArray = useFieldArray({
    control: form.control,
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

  const onSubmit: SubmitHandler<PlayerFormType> = async (data) => {
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

    toast("Successfully created/updated player");
  };

  return {
    form,
    fieldArray,
    addAvailability,
    onSubmit,
  };
};
