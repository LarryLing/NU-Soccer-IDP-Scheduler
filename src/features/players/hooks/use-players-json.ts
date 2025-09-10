import { useRef, type ChangeEvent, type RefObject } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";

import useScheduleStore from "@/features/schedule/hooks/use-schedule-store";
import { PlayerSchema } from "@/schemas/player.schema";

import usePlayersStore from "./use-players-store";

type UsePlayersJsonType = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleOpenFileInput: () => void;
  handleExportPlayersJson: () => void;
  handleImportPlayersJson: (event: ChangeEvent<HTMLInputElement>) => void;
};

const usePlayersJson = (): UsePlayersJsonType => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFileInput = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleExportPlayersJson = () => {
    const { players } = usePlayersStore.getState();

    const stringifiedJson = JSON.stringify(players, null, 2);

    const blob = new Blob([stringifiedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `players_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportPlayersJson = () => {
    if (!fileInputRef.current) return;

    const file = fileInputRef.current.files?.[0];

    if (!file) return;

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      toast.error("Failed to upload players", {
        description: "Please upload a JSON file",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>): void => {
      try {
        const result = e.target?.result;
        if (typeof result !== "string") {
          throw new Error("Failed to parse json");
        }

        const parsed = JSON.parse(result);
        const validatedPlayers = PlayerSchema.array().parse(parsed);

        const { setPlayers } = usePlayersStore.getState();
        const { trainingBlocks, setTrainingBlocks } = useScheduleStore.getState();

        const updatedPlayers = [...validatedPlayers].map((validatedPlayer) => {
          if (validatedPlayer.trainingBlockId === null) {
            return validatedPlayer;
          }

          return {
            ...validatedPlayer,
            trainingBlockId: trainingBlocks.some(
              (trainingBlock) => trainingBlock.id === validatedPlayer.trainingBlockId
            )
              ? validatedPlayer.trainingBlockId
              : null,
          };
        });

        const updatedTrainingBlocks = [...trainingBlocks].map((trainingBlock) => {
          const updatedAssignPlayerCount = updatedPlayers.reduce((accumulator, player) => {
            if (player.trainingBlockId === trainingBlock.id) {
              return accumulator + 1;
            }
            return accumulator;
          }, 0);

          return {
            ...trainingBlock,
            assignedPlayerCount: updatedAssignPlayerCount,
          };
        });

        setPlayers(updatedPlayers);
        setTrainingBlocks(updatedTrainingBlocks);

        toast.success("Successfully uploaded players");
      } catch (error) {
        let errorMessage = "An unknown error occured";
        if (error instanceof ZodError) {
          errorMessage = error.issues[0]?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        toast.error("Failed to upload players", {
          description: errorMessage,
        });
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.onerror = (): void => {
      toast.error("Failed to upload players", {
        description: "An unknown error occured",
      });
    };

    reader.readAsText(file);
  };

  return {
    fileInputRef,
    handleOpenFileInput,
    handleExportPlayersJson,
    handleImportPlayersJson,
  };
};

export default usePlayersJson;
