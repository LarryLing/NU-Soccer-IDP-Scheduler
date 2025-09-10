import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import usePlayersStore from "@/features/players/hooks/use-players-store";
import { getTimeStringWithMeridian } from "@/lib/time";

import useScheduleStore from "../../hooks/use-schedule-store";
import type { UseTrainingBlockDialogReturn } from "../../hooks/use-training-block-dialog";

import TrainingBlockDialogAssignedPlayersList from "./training-block-dialog-assigned-players-list";
import TrainingBlockDialogSearchCombobox from "./training-block-dialog-search-combobox";
import UnavailablePlayersAlert from "./unavailable-players-alert";

type EditTrainingBlockDialogProps = Pick<
  UseTrainingBlockDialogReturn,
  | "isTrainingBlockDialogOpen"
  | "setIsTrainingBlockDialogOpen"
  | "selectedTrainingBlock"
  | "setSelectedTrainingBlock"
  | "assignedPlayers"
  | "setAssignedPlayers"
  | "unavailablePlayerNames"
  | "assignPlayer"
  | "unassignPlayer"
>;

const EditTrainingBlockDialog = ({
  isTrainingBlockDialogOpen,
  setIsTrainingBlockDialogOpen,
  selectedTrainingBlock,
  setSelectedTrainingBlock,
  assignedPlayers,
  setAssignedPlayers,
  unavailablePlayerNames,
  assignPlayer,
  unassignPlayer,
}: EditTrainingBlockDialogProps) => {
  if (!selectedTrainingBlock) return null;

  const { day, start, end } = selectedTrainingBlock;

  const updateTrainingBlock = () => {
    if (!selectedTrainingBlock) return;

    const { players, setPlayers } = usePlayersStore.getState();
    const { trainingBlocks, setTrainingBlocks } = useScheduleStore.getState();

    const updatedPlayers = [...players].map((player) => {
      if (assignedPlayers.some((assignedPlayer) => assignedPlayer.id === player.id)) {
        return {
          ...player,
          trainingBlockId: selectedTrainingBlock.id,
        };
      }

      return {
        ...player,
        trainingBlockId: player.trainingBlockId === selectedTrainingBlock.id ? null : player.trainingBlockId,
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
  };

  const deleteTrainingBlock = () => {
    if (!selectedTrainingBlock) return;

    const { players, setPlayers } = usePlayersStore.getState();
    const { trainingBlocks, setTrainingBlocks } = useScheduleStore.getState();

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
  };

  return (
    <Dialog open={isTrainingBlockDialogOpen} onOpenChange={setIsTrainingBlockDialogOpen}>
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">Edit Training Block</DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            {day} • {getTimeStringWithMeridian(start)} - {getTimeStringWithMeridian(end)}
          </DialogDescription>
        </DialogHeader>
        <TrainingBlockDialogSearchCombobox
          selectedTrainingBlock={selectedTrainingBlock}
          assignedPlayers={assignedPlayers}
          assignPlayer={assignPlayer}
        />
        <TrainingBlockDialogAssignedPlayersList
          selectedTrainingBlock={selectedTrainingBlock}
          assignedPlayers={assignedPlayers}
          unassignPlayer={unassignPlayer}
        />
        <UnavailablePlayersAlert unavailablePlayerNames={unavailablePlayerNames} />
        <DialogFooter>
          <Button variant="destructive" onClick={deleteTrainingBlock}>
            Delete Training Block
          </Button>
          <Button onClick={updateTrainingBlock}>Save Training Block</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTrainingBlockDialog;
