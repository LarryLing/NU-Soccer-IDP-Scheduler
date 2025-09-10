import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import usePlayersStore from "@/features/players/hooks/use-players-store";

import useScheduleStore from "../../hooks/use-schedule-store";
import useTrainingBlockDialog from "../../hooks/use-training-block-dialog";

import TrainingBlockDialogAssignedPlayersList from "./training-block-dialog-assigned-players-list";
import TrainingBlockDialogSearchCombobox from "./training-block-dialog-search-combobox";
import TrainingBlockDialogSelectCombobox from "./training-block-dialog-select-combobox";
import UnavailablePlayersAlert from "./unavailable-players-alert";

const CreateTrainingBlockDialog = () => {
  const {
    isTrainingBlockDialogOpen,
    setIsTrainingBlockDialogOpen,
    selectedTrainingBlock,
    setSelectedTrainingBlock,
    assignedPlayers,
    setAssignedPlayers,
    unavailablePlayerNames,
    assignPlayer,
    unassignPlayer,
  } = useTrainingBlockDialog();

  const createTrainingBlock = () => {
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
    setAssignedPlayers([]);
    setIsTrainingBlockDialogOpen(false);
  };

  return (
    <Dialog open={isTrainingBlockDialogOpen} onOpenChange={setIsTrainingBlockDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarPlus />
          Create Training Block
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">Create Training Block</DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            Create a training block with custom player assignments
          </DialogDescription>
        </DialogHeader>
        <TrainingBlockDialogSelectCombobox
          selectedTrainingBlock={selectedTrainingBlock}
          setSelectedTrainingBlock={setSelectedTrainingBlock}
        />
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
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={createTrainingBlock}
            disabled={selectedTrainingBlock === null || assignedPlayers.length === 0}
          >
            Create Training Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTrainingBlockDialog;
