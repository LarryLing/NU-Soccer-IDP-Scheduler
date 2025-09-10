import { useCallback, useState } from "react";

import usePlayersStore from "@/features/players/hooks/use-players-store";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { isPlayerAvailableForTrainingBlock } from "../lib/schedule";

export type UseTrainingBlockDialogReturn = {
  isTrainingBlockDialogOpen: boolean;
  setIsTrainingBlockDialogOpen: (isTrainingBlockDialogOpen: boolean) => void;
  selectedTrainingBlock: TrainingBlock | null;
  setSelectedTrainingBlock: (selectedTrainingBlock: TrainingBlock | null) => void;
  assignedPlayers: Player[];
  setAssignedPlayers: (assignedPlayers: Player[]) => void;
  unavailablePlayerNames: Player["name"][];
  assignPlayer: (playerId: Player["id"], trainingBlockId: TrainingBlock["id"]) => void;
  unassignPlayer: (playerId: Player["id"]) => void;
};

const useTrainingBlockDialog = () => {
  const [isTrainingBlockDialogOpen, setIsTrainingBlockDialogOpen] = useState<boolean>(false);
  const [selectedTrainingBlock, setSelectedTrainingBlock] = useState<TrainingBlock | null>(null);
  const [assignedPlayers, setAssignedPlayers] = useState<Player[]>([]);

  const unavailablePlayerNames = selectedTrainingBlock
    ? assignedPlayers
        .filter((assignedPlayer) => !isPlayerAvailableForTrainingBlock(assignedPlayer.id, selectedTrainingBlock.id))
        .map((assignedPlayer) => assignedPlayer.name)
    : [];

  const assignPlayer = useCallback((playerName: Player["name"], trainingBlockId: TrainingBlock["id"]) => {
    const { players } = usePlayersStore.getState();
    const player = players.find((player) => player.name === playerName);
    if (!player) return;
    setAssignedPlayers((prevAssignedPlayers) => [
      ...prevAssignedPlayers,
      { ...player, trainingBlockId: trainingBlockId },
    ]);
  }, []);

  const unassignPlayer = useCallback(
    (playerId: Player["id"]) => {
      const updatedAssignedPlayers = [...assignedPlayers].filter((assignedPlayer) => assignedPlayer.id !== playerId);
      setAssignedPlayers(updatedAssignedPlayers);
    },
    [assignedPlayers]
  );

  return {
    isTrainingBlockDialogOpen,
    setIsTrainingBlockDialogOpen,
    selectedTrainingBlock,
    setSelectedTrainingBlock,
    assignedPlayers,
    setAssignedPlayers,
    unavailablePlayerNames,
    assignPlayer,
    unassignPlayer,
  };
};

export default useTrainingBlockDialog;
