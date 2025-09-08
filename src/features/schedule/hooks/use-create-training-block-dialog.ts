import { useCallback, useState } from "react";

import usePlayersStore from "@/features/players/hooks/use-players-store";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import useScheduleStore from "./use-schedule-store";

export type UseCreateTrainingBlockDialogReturn = {
  isTrainingBlockDialogOpen: boolean;
  setIsTrainingBlockDialogOpen: (isTrainingBlockDialogOpen: boolean) => void;
  selectedTrainingBlock: TrainingBlock | null;
  assignedPlayers: Player[];
  selectTrainingBlock: (trainingBlockId: TrainingBlock["id"]) => void;
  assignPlayer: (playerId: Player["id"], trainingBlockId: TrainingBlock["id"]) => void;
  unassignPlayer: (playerId: Player["id"]) => void;
  createTrainingBlock: () => void;
};

const useCreateTrainingBlockDialog = () => {
  const players = usePlayersStore((state) => state.players);
  const trainingBlocks = useScheduleStore((state) => state.trainingBlocks);

  const [isTrainingBlockDialogOpen, setIsTrainingBlockDialogOpen] = useState<boolean>(false);
  const [selectedTrainingBlock, setSelectedTrainingBlock] = useState<TrainingBlock | null>(null);
  const [assignedPlayers, setAssignedPlayers] = useState<Player[]>([]);

  const selectTrainingBlock = useCallback(
    (trainingBlockId: TrainingBlock["id"]) => {
      setSelectedTrainingBlock(trainingBlocks.find((trainingBlock) => trainingBlock.id === trainingBlockId) || null);
    },
    [trainingBlocks]
  );

  const assignPlayer = useCallback(
    (playerId: Player["id"], trainingBlockId: TrainingBlock["id"]) => {
      const player = players.find((player) => player.id === playerId);
      if (!player) return;
      setAssignedPlayers((prevAssignedPlayers) => [
        ...prevAssignedPlayers,
        { ...player, trainingBlockId: trainingBlockId },
      ]);
    },
    [players]
  );

  const unassignPlayer = useCallback(
    (playerId: Player["id"]) => {
      const updatedAssignedPlayers = [...assignedPlayers].filter((assignedPlayer) => assignedPlayer.id !== playerId);
      setAssignedPlayers(updatedAssignedPlayers);
    },
    [assignedPlayers]
  );

  const createTrainingBlock = useCallback(() => {
    if (!selectedTrainingBlock) return;

    const setPlayers = usePlayersStore.getState().setPlayers;
    const setTrainingBlocks = useScheduleStore.getState().setTrainingBlocks;

    const updatedPlayers = [...players].map((player) => {
      if (assignedPlayers.some((assignedPlayer) => assignedPlayer.id === player.id)) {
        return {
          ...player,
          trainingBlockId: selectedTrainingBlock.id,
        };
      }

      return player;
    });

    const updatedTrainingBlocks = [...trainingBlocks].map((trainingBlock) => {
      if (trainingBlock.id === selectedTrainingBlock.id) {
        return {
          ...trainingBlock,
          assignedPlayerCount: assignedPlayers.length,
        };
      }

      return trainingBlock;
    });

    setPlayers(updatedPlayers);
    setTrainingBlocks(updatedTrainingBlocks);
    setSelectedTrainingBlock(null);
    setAssignedPlayers([]);
    setIsTrainingBlockDialogOpen(false);
  }, [assignedPlayers, players, selectedTrainingBlock, trainingBlocks]);

  return {
    isTrainingBlockDialogOpen,
    setIsTrainingBlockDialogOpen,
    selectedTrainingBlock,
    assignedPlayers,
    selectTrainingBlock,
    assignPlayer,
    unassignPlayer,
    createTrainingBlock,
  };
};

export default useCreateTrainingBlockDialog;
