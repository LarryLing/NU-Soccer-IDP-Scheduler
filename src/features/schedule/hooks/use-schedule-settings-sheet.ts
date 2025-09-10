import { useState, useCallback } from "react";

export type UseScheduleSettingsSheetReturn = {
  isScheduleSettingsSheetOpen: boolean;
  setIsScheduleSettingsSheetOpen: (isScheduleSettingsSheetOpen: boolean) => void;
  closeScheduleSettingsSheet: () => void;
};

export const useScheduleSettingsSheet = (): UseScheduleSettingsSheetReturn => {
  const [isScheduleSettingsSheetOpen, setIsScheduleSettingsSheetOpen] = useState<boolean>(false);

  const closeScheduleSettingsSheet = useCallback(() => {
    setIsScheduleSettingsSheetOpen(false);
  }, []);

  return {
    isScheduleSettingsSheetOpen,
    setIsScheduleSettingsSheetOpen,
    closeScheduleSettingsSheet,
  };
};
