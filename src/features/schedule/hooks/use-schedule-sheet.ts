import { useState, useCallback } from "react";

export type UseScheduleSheetReturn = {
  isScheduleSheetOpen: boolean;
  setIsScheduleSheetOpen: (isScheduleSheetOpen: boolean) => void;
  openScheduleSheet: () => void;
};

export const useScheduleSheet = (): UseScheduleSheetReturn => {
  const [isScheduleSheetOpen, setIsScheduleSheetOpen] = useState<boolean>(false);

  const openScheduleSheet = useCallback(() => {
    setIsScheduleSheetOpen(true);
  }, []);

  return {
    isScheduleSheetOpen,
    setIsScheduleSheetOpen,
    openScheduleSheet,
  };
};
