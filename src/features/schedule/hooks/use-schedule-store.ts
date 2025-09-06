import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { TrainingBlock } from "@/schemas/training-block.schema";

import type { ScheduleSettings } from "../schemas/schedule-settings.schema";

export type UseScheduleStoreReturn = {
  trainingBlocks: TrainingBlock[];
  setTrainingBlocks: (trainingBlocks: TrainingBlock[]) => void;
  scheduleSettings: ScheduleSettings;
  setScheduleSettings: (scheduleSettings: ScheduleSettings) => void;
};

const useScheduleStore = create<UseScheduleStoreReturn>()(
  persist(
    (set) => ({
      trainingBlocks: [],
      setTrainingBlocks: (trainingBlocks: TrainingBlock[]) => {
        set(() => ({
          trainingBlocks,
        }));
      },
      scheduleSettings: {
        availabilities: [],
        duration: 30,
        maximumPlayerCount: 4,
      },
      setScheduleSettings: (scheduleSettings: ScheduleSettings) => {
        set(() => ({
          scheduleSettings,
        }));
      },
    }),
    {
      name: "schedule-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useScheduleStore;
