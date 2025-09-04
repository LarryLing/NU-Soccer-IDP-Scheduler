import type { TrainingBlock } from "@/types/training-block.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UseTrainingBlocksReturn = {
  trainingBlocks: TrainingBlock[];
  setTrainingBlocks: (trainingBlocks: TrainingBlock[]) => void;
};

const useTrainingBlocksStore = create<UseTrainingBlocksReturn>()(
  persist(
    (set) => ({
      trainingBlocks: [],
      setTrainingBlocks: (trainingBlocks: TrainingBlock[]) => {
        set(() => ({
          trainingBlocks,
        }));
      },
    }),
    {
      name: "training-blocks-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTrainingBlocksStore;
