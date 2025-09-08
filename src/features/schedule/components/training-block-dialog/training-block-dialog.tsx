import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTimeStringWithMeridian } from "@/lib/time";

import type { UseTrainingBlockDialogReturn } from "../../hooks/use-training-block-dialog";

import TrainingBlockDialogAssignedPlayersList from "./training-block-dialog-assigned-players-list";
import TrainingBlockDialogSearchCombobox from "./training-block-dialog-search-combobox";

type TrainingBlockDialogProps = Pick<
  UseTrainingBlockDialogReturn,
  | "isTrainingBlockDialogOpen"
  | "setIsTrainingBlockDialogOpen"
  | "selectedTrainingBlock"
  | "assignedPlayers"
  | "assignPlayer"
  | "unassignPlayer"
  | "deleteTrainingBlock"
>;

const TrainingBlockDialog = ({
  isTrainingBlockDialogOpen,
  setIsTrainingBlockDialogOpen,
  selectedTrainingBlock,
  assignedPlayers,
  assignPlayer,
  unassignPlayer,
  deleteTrainingBlock,
}: TrainingBlockDialogProps) => {
  if (!selectedTrainingBlock) return null;

  const { day, start, end } = selectedTrainingBlock!;

  return (
    <Dialog open={isTrainingBlockDialogOpen} onOpenChange={setIsTrainingBlockDialogOpen}>
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">{day}</DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            {getTimeStringWithMeridian(start)} - {getTimeStringWithMeridian(end)}
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
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingBlockDialog;
