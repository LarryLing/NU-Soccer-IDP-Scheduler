import { useState, useCallback } from "react";

export type UseScheduleSheetReturn = {
  isScheduleSheetOpen: boolean;
  setIsScheduleSheetOpen: (isScheduleSheetOpen: boolean) => void;
  closeScheduleSheet: () => void;
};

export const useScheduleSheet = (): UseScheduleSheetReturn => {
  const [isScheduleSheetOpen, setIsScheduleSheetOpen] = useState<boolean>(false);

  const closeScheduleSheet = useCallback(() => {
    setIsScheduleSheetOpen(false);
  }, []);

  return {
    isScheduleSheetOpen,
    setIsScheduleSheetOpen,
    closeScheduleSheet,
  };
};
