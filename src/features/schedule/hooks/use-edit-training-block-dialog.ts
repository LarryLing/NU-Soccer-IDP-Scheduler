import { useCallback, useState } from "react";

import usePlayersStore from "@/features/players/hooks/use-players-store";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { isPlayerAvailableForTrainingBlock } from "../lib/schedule";

import useScheduleStore from "./use-schedule-store";

export type UseEditTrainingBlockDialogReturn = {
  isTrainingBlockDialogOpen: boolean;
  setIsTrainingBlockDialogOpen: (isTrainingBlockDialogOpen: boolean) => void;
  selectedTrainingBlock: TrainingBlock | null;
  openTrainingBlockDialog: (trainingBlockId: TrainingBlock["id"]) => void;
  assignedPlayers: Player[];
  unavailablePlayerNames: Player["name"][];
  assignPlayer: (playerId: Player["id"], trainingBlockId: TrainingBlock["id"]) => void;
  unassignPlayer: (playerId: Player["id"]) => void;
  updateTrainingBlock: () => void;
  deleteTrainingBlock: () => void;
};

const useEditTrainingBlockDialog = () => {
  const players = usePlayersStore((state) => state.players);
  const trainingBlocks = useScheduleStore((state) => state.trainingBlocks);

  const [isTrainingBlockDialogOpen, setIsTrainingBlockDialogOpen] = useState<boolean>(false);
  const [selectedTrainingBlock, setSelectedTrainingBlock] = useState<TrainingBlock | null>(null);
  const [assignedPlayers, setAssignedPlayers] = useState<Player[]>([]);

  const unavailablePlayerNames = selectedTrainingBlock
    ? assignedPlayers
        .filter((assignedPlayer) => !isPlayerAvailableForTrainingBlock(assignedPlayer.id, selectedTrainingBlock.id))
        .map((assignedPlayer) => assignedPlayer.name)
    : [];

  const openTrainingBlockDialog = useCallback(
    (trainingBlockId: TrainingBlock["id"]) => {
      setSelectedTrainingBlock(trainingBlocks.find((trainingBlock) => trainingBlock.id === trainingBlockId) || null);
      setAssignedPlayers(players.filter((player) => player.trainingBlockId === trainingBlockId));
      setIsTrainingBlockDialogOpen(true);
    },
    [players, trainingBlocks]
  );

  const assignPlayer = useCallback(
    (playerName: Player["name"], trainingBlockId: TrainingBlock["id"]) => {
      const player = players.find((player) => player.name === playerName);
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

  const updateTrainingBlock = useCallback(() => {
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

      return {
        ...player,
        trainingBlockId: null,
      };
    });

    const updatedTrainingBlocks = [...trainingBlocks].map((trainingBlock) => {
      const updatedAssignPlayerCount = updatedPlayers.reduce((accumulator, player) => {
        if (player.trainingBlockId === trainingBlock.id) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      return {
        ...trainingBlock,
        assignedPlayerCount: updatedAssignPlayerCount,
      };
    });

    setPlayers(updatedPlayers);
    setTrainingBlocks(updatedTrainingBlocks);
    setSelectedTrainingBlock(null);
    setAssignedPlayers([]);
    setIsTrainingBlockDialogOpen(false);
  }, [assignedPlayers, players, selectedTrainingBlock, trainingBlocks]);

  const deleteTrainingBlock = useCallback(() => {
    if (!selectedTrainingBlock) return;

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

    const updatedTrainingBlocks = [...trainingBlocks].map((trainingBlock) => {
      const updatedAssignPlayerCount = updatedPlayers.reduce((accumulator, player) => {
        if (player.trainingBlockId === trainingBlock.id) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      return {
        ...trainingBlock,
        assignedPlayerCount: updatedAssignPlayerCount,
      };
    });

    setPlayers(updatedPlayers);
    setTrainingBlocks(updatedTrainingBlocks);
    setSelectedTrainingBlock(null);
    setIsTrainingBlockDialogOpen(false);
  }, [players, selectedTrainingBlock, trainingBlocks]);

  return {
    isTrainingBlockDialogOpen,
    setIsTrainingBlockDialogOpen,
    selectedTrainingBlock,
    openTrainingBlockDialog,
    assignedPlayers,
    unavailablePlayerNames,
    assignPlayer,
    unassignPlayer,
    updateTrainingBlock,
    deleteTrainingBlock,
  };
};

export default useEditTrainingBlockDialog;
