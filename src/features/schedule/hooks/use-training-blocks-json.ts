import { useRef, type ChangeEvent, type RefObject } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";

import { TrainingBlockSchema } from "@/schemas/training-block.schema";

import useTrainingBlocksStore from "./use-training-blocks-store";

type UseTrainingBlocksJsonType = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleOpenFileInput: () => void;
  handleExportTrainingBlocksJson: () => void;
  handleImportTrainingBlocksJson: (event: ChangeEvent<HTMLInputElement>) => void;
};

const useTrainingBlocksJson = (): UseTrainingBlocksJsonType => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFileInput = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleExportTrainingBlocksJson = () => {
    const { trainingBlocks } = useTrainingBlocksStore.getState();

    const stringifiedJson = JSON.stringify(trainingBlocks, null, 2);

    const blob = new Blob([stringifiedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `training_blocks_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportTrainingBlocksJson = (event: ChangeEvent<HTMLInputElement>) => {
    const { setTrainingBlocks } = useTrainingBlocksStore.getState();

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
          throw new Error("Failed to parse json");
        }

        const parsed = JSON.parse(result);
        const validatedTrainingBlocks = TrainingBlockSchema.array().parse(parsed);
        setTrainingBlocks(validatedTrainingBlocks);

        toast.success("Successfully uploaded training blocks");
      } catch (error) {
        let errorMessage = "An unknown error occured";
        if (error instanceof ZodError) {
          errorMessage = error.issues[0]?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

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
