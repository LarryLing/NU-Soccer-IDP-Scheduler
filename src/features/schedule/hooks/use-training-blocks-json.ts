import { useRef, type ChangeEvent, type RefObject } from "react";
import { toast } from "sonner";

import { exportJson } from "@/lib/json";
import type { TrainingBlock } from "@/types/training-block.type";

import useTrainingBlocksStore from "./use-training-blocks-store";

type UseTrainingBlocksJsonType = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleOpenFileInput: () => void;
  handleExportTrainingBlocksJson: () => void;
  handleImportTrainingBlocksJson: (event: ChangeEvent<HTMLInputElement>) => void;
};

const useTrainingBlocksJson = (): UseTrainingBlocksJsonType => {
  const trainingBlocks = useTrainingBlocksStore((state) => state.trainingBlocks);
  const setTrainingBlocks = useTrainingBlocksStore((state) => state.setTrainingBlocks);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFileInput = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleExportTrainingBlocksJson = () => {
    const filename = `training_blocks_${Date.now()}`;
    exportJson(trainingBlocks, filename);
  };

  const handleImportTrainingBlocksJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      toast.error("Failed to upload training blocks", {
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

        const parsed: TrainingBlock[] = JSON.parse(result);

        setTrainingBlocks(parsed);

        toast.success("Successfully uploaded training blocks");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Invalid JSON file";
        toast.error("Failed to upload training blocks", {
          description: errorMessage,
        });
      }
    };

    reader.onerror = (): void => {
      toast.error("Failed to upload training blocks", {
        description: "An unknown error occured",
      });
    };

    reader.readAsText(file);
  };

  return {
    fileInputRef,
    handleOpenFileInput,
    handleExportTrainingBlocksJson,
    handleImportTrainingBlocksJson,
  };
};

export default useTrainingBlocksJson;
