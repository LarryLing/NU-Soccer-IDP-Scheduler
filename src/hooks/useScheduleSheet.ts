import { useState, useCallback } from "react";
import type { Player, UseScheduleSheetReturn } from "../lib/types.ts";

export const useScheduleSheet = (players: Player[]): UseScheduleSheetReturn => {
  const [isScheduleSheetOpen, setIsScheduleSheetOpen] =
    useState<boolean>(false);
  const [isSchedulingPlayers, setIsSchedulingPlayers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const openScheduleSheet = useCallback(() => {
    setError(null);
    setIsScheduleSheetOpen(true);
  }, [setError]);

  const addFieldAvailability = useCallback(() => {
    throw new Error("Not yet implemented");
  }, []);

  const schedulePlayers = useCallback(() => {
    console.log(players);
    throw new Error("Not yet implemented");
  }, []);

  return {
    isScheduleSheetOpen,
    setIsScheduleSheetOpen,
    isSchedulingPlayers,
    setIsSchedulingPlayers,
    error,
    setError,
    openScheduleSheet,
    addFieldAvailability,
    schedulePlayers,
  };
};
