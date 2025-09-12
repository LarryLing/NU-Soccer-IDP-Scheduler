import { useCallback, useState } from "react";

import { usePlayersActions } from "@/features/players/hooks/use-players-store";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import { useScheduleActions } from "./use-schedule-store";

export type UseEditTrainingBlockDialogReturn = {
  isTrainingBlockDialogOpen: boolean;
  setIsTrainingBlockDialogOpen: (isTrainingBlockDialogOpen: boolean) => void;
  selectedTrainingBlock: TrainingBlock | null;
  setSelectedTrainingBlock: (selectedTrainingBlock: TrainingBlock | null) => void;
  assignedPlayers: Player[];
  assignments: Record<Player["id"], Player["trainingBlockId"]>;
  openTrainingBlockDialog: (trainingBlockId: TrainingBlock["id"]) => void;
  addAssignment: (playerName: Player["name"]) => void;
  removeAssignment: (playerId: Player["id"]) => void;
  confirmAssignments: () => void;
};

const useEditTrainingBlockDialog = () => {
  const { getPlayerById, getPlayerByName, getPlayersByTrainingBlockId, assignPlayersToTrainingBlocks } =
    usePlayersActions();
  const { getTrainingBlockById } = useScheduleActions();

  const [isTrainingBlockDialogOpen, setIsTrainingBlockDialogOpen] = useState<boolean>(false);
  const [selectedTrainingBlock, setSelectedTrainingBlock] = useState<TrainingBlock | null>(null);
  const [assignedPlayers, setAssignedPlayers] = useState<Player[]>([]);
  const [assignments, setAssignments] = useState<Record<Player["id"], Player["trainingBlockId"]>>({});

  const openTrainingBlockDialog = useCallback(
    (trainingBlockId: TrainingBlock["id"]) => {
      setSelectedTrainingBlock(getTrainingBlockById(trainingBlockId));
      setAssignedPlayers(getPlayersByTrainingBlockId(trainingBlockId));
      setAssignments({});
      setIsTrainingBlockDialogOpen(true);
    },
    [getTrainingBlockById, getPlayersByTrainingBlockId]
  );

  const addAssignment = useCallback(
    (playerName: Player["name"]) => {
      const player = getPlayerByName(playerName);
      if (!player || !selectedTrainingBlock) return;

      setAssignedPlayers((prevAssignedPlayers) => [...prevAssignedPlayers, player]);
      setAssignments((prevAssignments) => {
        return { ...prevAssignments, [player.id]: selectedTrainingBlock.id };
      });
    },
    [getPlayerByName, selectedTrainingBlock]
  );

  const removeAssignment = useCallback(
    (playerId: Player["id"]) => {
      const player = getPlayerById(playerId);
      if (!player || !selectedTrainingBlock) return;

      setAssignedPlayers((prevAssignedPlayers) =>
        [...prevAssignedPlayers].filter((prevAssignedPlayer) => prevAssignedPlayer.id !== player.id)
      );
      setAssignments((prevAssignments) => {
        return {
          ...prevAssignments,
          [playerId]: player.trainingBlockId === selectedTrainingBlock.id ? null : player.trainingBlockId,
        };
      });
    },
    [getPlayerById, selectedTrainingBlock]
  );

  const confirmAssignments = useCallback(() => {
    assignPlayersToTrainingBlocks(assignments);

    setIsTrainingBlockDialogOpen(false);
  }, [assignPlayersToTrainingBlocks, assignments]);

  return {
    isTrainingBlockDialogOpen,
    setIsTrainingBlockDialogOpen,
    selectedTrainingBlock,
    setSelectedTrainingBlock,
    assignedPlayers,
    assignments,
    openTrainingBlockDialog,
    addAssignment,
    removeAssignment,
    confirmAssignments,
  };
};

export default useEditTrainingBlockDialog;
