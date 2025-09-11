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
    addAssignment,
    removeAssignment,
    confirmAssignments,
  } = useTrainingBlockDialog();

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
          addAssignment={addAssignment}
        />
        <TrainingBlockDialogAssignedPlayersList
          selectedTrainingBlock={selectedTrainingBlock}
          assignedPlayers={assignedPlayers}
          removeAssignment={removeAssignment}
        />
        <UnavailablePlayersAlert selectedTrainingBlock={selectedTrainingBlock} assignedPlayers={assignedPlayers} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={confirmAssignments}
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
