import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTimeStringWithMeridian } from "@/lib/time";

import type { UseEditTrainingBlockDialogReturn } from "../../hooks/use-edit-training-block-dialog";

import TrainingBlockDialogAssignedPlayersList from "./training-block-dialog-assigned-players-list";
import TrainingBlockDialogSearchCombobox from "./training-block-dialog-search-combobox";

type EditTrainingBlockDialogProps = Pick<
  UseEditTrainingBlockDialogReturn,
  | "isTrainingBlockDialogOpen"
  | "setIsTrainingBlockDialogOpen"
  | "selectedTrainingBlock"
  | "assignedPlayers"
  | "assignPlayer"
  | "unassignPlayer"
  | "updateTrainingBlock"
  | "deleteTrainingBlock"
>;

const EditTrainingBlockDialog = ({
  isTrainingBlockDialogOpen,
  setIsTrainingBlockDialogOpen,
  selectedTrainingBlock,
  assignedPlayers,
  assignPlayer,
  unassignPlayer,
  updateTrainingBlock,
  deleteTrainingBlock,
}: EditTrainingBlockDialogProps) => {
  if (!selectedTrainingBlock) return null;

  const { day, start, end } = selectedTrainingBlock!;

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
