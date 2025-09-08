import { useCallback, useState } from "react";

import usePlayersStore from "@/features/players/hooks/use-players-store";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import useScheduleStore from "./use-schedule-store";

export type UseEditTrainingBlockDialogReturn = {
  isTrainingBlockDialogOpen: boolean;
  setIsTrainingBlockDialogOpen: (isTrainingBlockDialogOpen: boolean) => void;
  selectedTrainingBlock: TrainingBlock | null;
  openTrainingBlockDialog: (trainingBlockId: TrainingBlock["id"]) => void;
  assignedPlayers: Player[];
  assignPlayer: (playerId: Player["id"], trainingBlockId: TrainingBlock["id"]) => void;
  unassignPlayer: (playerId: Player["id"]) => void;
  deleteTrainingBlock: () => void;
};

const useEditTrainingBlockDialog = () => {
  const players = usePlayersStore((state) => state.players);
  const trainingBlocks = useScheduleStore((state) => state.trainingBlocks);

  const [isTrainingBlockDialogOpen, setIsTrainingBlockDialogOpen] = useState<boolean>(false);
  const [selectedTrainingBlock, setSelectedTrainingBlock] = useState<TrainingBlock | null>(null);

  const assignedPlayers = players.filter((player) => player.trainingBlockId === selectedTrainingBlock?.id);

  const openTrainingBlockDialog = useCallback(
    (trainingBlockId: TrainingBlock["id"]) => {
      setSelectedTrainingBlock(trainingBlocks.find((trainingBlock) => trainingBlock.id === trainingBlockId) || null);
      setIsTrainingBlockDialogOpen(true);
    },
    [trainingBlocks]
  );

  const assignPlayer = useCallback(
    (playerId: Player["id"], trainingBlockId: TrainingBlock["id"]) => {
      const setPlayers = usePlayersStore.getState().setPlayers;

      const updatedPlayers = [...players].map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            trainingBlockId,
          };
        }

        return player;
      });

      setPlayers(updatedPlayers);
    },
    [players]
  );

  const unassignPlayer = useCallback(
    (playerId: Player["id"]) => {
      const setPlayers = usePlayersStore.getState().setPlayers;

      const updatedPlayers = [...players].map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            trainingBlockId: null,
          };
        }

        return player;
      });

      setPlayers(updatedPlayers);
    },
    [players]
  );

  const deleteTrainingBlock = useCallback(() => {
    const setPlayers = usePlayersStore.getState().setPlayers;
    const setTrainingBlocks = useScheduleStore.getState().setTrainingBlocks;

    const updatedPlayers = [...players].map((player) => {
      if (player.trainingBlockId === selectedTrainingBlock?.id) {
        return {
          ...player,
          trainingBlockId: null,
        };
      }

      return player;
    });

    const updatedTrainingBlocks = [...trainingBlocks].filter(
      (trainingBlock) => trainingBlock.id !== selectedTrainingBlock?.id
    );

    setPlayers(updatedPlayers);
    setTrainingBlocks(updatedTrainingBlocks);
    setSelectedTrainingBlock(null);
    setIsTrainingBlockDialogOpen(false);
  }, [players, selectedTrainingBlock?.id, trainingBlocks]);

  return {
    isTrainingBlockDialogOpen,
    setIsTrainingBlockDialogOpen,
    selectedTrainingBlock,
    openTrainingBlockDialog,
    assignedPlayers,
    assignPlayer,
    unassignPlayer,
    deleteTrainingBlock,
  };
};

export default useEditTrainingBlockDialog;
