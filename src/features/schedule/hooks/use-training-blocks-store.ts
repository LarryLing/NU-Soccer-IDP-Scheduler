import type { TrainingBlock } from "@/features/schedule/types/training-block.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UseTrainingBlocksReturn = {
  trainingBlocks: TrainingBlock[];
  createTrainingBlock: (trainingBlock: TrainingBlock) => void;
  deleteTrainingBlock: (trainingBlockId: TrainingBlock["id"]) => void;
};

const useTrainingBlocksStore = create<UseTrainingBlocksReturn>()(
  persist(
    (set) => ({
      trainingBlocks: [],
      createTrainingBlock: (trainingBlock: Omit<TrainingBlock, "id">) => {
        set((state) => ({
          trainingBlocks: [...state.trainingBlocks, { id: crypto.randomUUID(), ...trainingBlock }],
        }));
      },
      deleteTrainingBlock: (trainingBlockId: TrainingBlock["id"]) => {
        set((state) => ({
          trainingBlocks: state.trainingBlocks.filter((trainingBlock) => trainingBlock.id !== trainingBlockId),
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
