import { useRef, type ChangeEvent, type RefObject } from "react";
import { toast } from "sonner";

import { exportJson } from "@/lib/json";
import type { Player } from "@/types/player.type";

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
    const players = usePlayersStore.getState().players;
    const filename = `players_${Date.now()}`;
    exportJson(players, filename);
  };

  const handleImportPlayersJson = (event: ChangeEvent<HTMLInputElement>) => {
    const setPlayers = usePlayersStore.getState().setPlayers;

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
          throw new Error("Failed to read file");
        }

        const parsed: Player[] = JSON.parse(result);

        setPlayers(parsed);

        toast.success("Successfully uploaded players");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Invalid JSON file";
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
