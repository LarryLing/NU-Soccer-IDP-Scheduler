import { useCallback, useState, type PropsWithChildren } from "react";
import { PlayerSheetContext } from "./player-sheet-context";
import { DEFAULT_PLAYER } from "@/lib/constants";
import { PlayerFormSchema } from "@/lib/schemas";
import type {
  PlayerMetadata,
  Player,
  Availability,
  PlayerSheetFormSchemaType,
  PlayerSheetContextType,
  Days,
} from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatTime, parseTime } from "@/lib/utils";
import { useForm, useFieldArray } from "react-hook-form";

export default function PlayerSheetProvider({ children }: PropsWithChildren) {
  const [playerMetadata, setPlayerMetadata] = useState<PlayerMetadata | null>(
    null,
  );
  const [isPlayerSheetOpen, setIsPlayerSheetOpen] = useState<boolean>(false);

  const form = useForm<PlayerSheetFormSchemaType>({
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
    (player: Player | null) => {
      if (player) {
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
    [reset],
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

  const value: PlayerSheetContextType = {
    playerMetadata,
    isPlayerSheetOpen,
    setIsPlayerSheetOpen,
    form,
    fieldArray,
    openPlayerSheet,
    addAvailability,
  };

  return (
    <PlayerSheetContext.Provider value={value}>
      {children}
    </PlayerSheetContext.Provider>
  );
}
