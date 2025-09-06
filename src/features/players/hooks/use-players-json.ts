import { useRef, type ChangeEvent, type RefObject } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";

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

  const handleImportPlayersJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

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
        setPlayers(validatedPlayers);

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
