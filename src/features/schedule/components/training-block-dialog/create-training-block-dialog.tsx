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

import useCreateTrainingBlockDialog from "../../hooks/use-create-training-block-dialog";

import TrainingBlockDialogAssignedPlayersList from "./training-block-dialog-assigned-players-list";
import TrainingBlockDialogSearchCombobox from "./training-block-dialog-search-combobox";
import TrainingBlockDialogSelectCombobox from "./training-block-dialog-select-combobox";
import UnavailablePlayersAlert from "./unavailable-players-alert";

const CreateTrainingBlockDialog = () => {
  const {
    isTrainingBlockDialogOpen,
    setIsTrainingBlockDialogOpen,
    selectedTrainingBlock,
    assignedPlayers,
    unavailablePlayerNames,
    selectTrainingBlock,
    assignPlayer,
    unassignPlayer,
    createTrainingBlock,
  } = useCreateTrainingBlockDialog();

  return (
    <Dialog open={isTrainingBlockDialogOpen} onOpenChange={setIsTrainingBlockDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarPlus />
          <span className="hidden lg:block">Create Training Block</span>
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
          selectTrainingBlock={selectTrainingBlock}
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
          <Button onClick={createTrainingBlock} disabled={selectedTrainingBlock === null}>
            Create Training Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTrainingBlockDialog;
