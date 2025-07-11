import type { Availability, Player, PlayerMetadata } from "@/lib/types";
import { useCallback, useState } from "react";
import type z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { PlayerFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PLAYER } from "@/lib/constants";

type FormSchema = z.infer<typeof PlayerFormSchema>;

export const usePlayerSheet = () => {
  const [playerMetadata, setPlayerMetadata] = useState<PlayerMetadata | null>(
    null,
  );
  const [isPlayerSheetOpen, setIsPlayerSheetOpen] = useState<boolean>(false);

  const form = useForm<FormSchema>({
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

  const openPlayerSheet = useCallback((player: Player | null) => {
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
  }, []);

  return {
    isPlayerSheetOpen,
    setIsPlayerSheetOpen,
    form,
    fieldArray,
    openPlayerSheet,
    playerMetadata,
  };
};
