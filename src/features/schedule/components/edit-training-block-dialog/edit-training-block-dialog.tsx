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

import type { UseEditTrainingBlockDialogReturn } from "../../hooks/use-edit-training-block-dialog";

import AssignedPlayersList from "./assigned-players-list";
import SearchPlayersCombobox from "./search-players-combobox";
import UnavailablePlayersAlert from "./unavailable-players-alert";

type EditTrainingBlockDialogProps = Pick<
  UseEditTrainingBlockDialogReturn,
  | "isTrainingBlockDialogOpen"
  | "setIsTrainingBlockDialogOpen"
  | "selectedTrainingBlock"
  | "assignedPlayers"
  | "addAssignment"
  | "removeAssignment"
  | "confirmAssignments"
>;

const EditTrainingBlockDialog = ({
  isTrainingBlockDialogOpen,
  setIsTrainingBlockDialogOpen,
  selectedTrainingBlock,
  assignedPlayers,
  addAssignment,
  removeAssignment,
  confirmAssignments,
}: EditTrainingBlockDialogProps) => {
  if (!selectedTrainingBlock) return null;

  const { day, start, end } = selectedTrainingBlock;

  return (
    <Dialog open={isTrainingBlockDialogOpen} onOpenChange={setIsTrainingBlockDialogOpen}>
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">Edit Training Block</DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            {day} • {getTimeStringWithMeridian(start)} - {getTimeStringWithMeridian(end)}
          </DialogDescription>
        </DialogHeader>
        <SearchPlayersCombobox
          selectedTrainingBlock={selectedTrainingBlock}
          assignedPlayers={assignedPlayers}
          addAssignment={addAssignment}
        />
        <AssignedPlayersList
          selectedTrainingBlock={selectedTrainingBlock}
          assignedPlayers={assignedPlayers}
          removeAssignment={removeAssignment}
        />
        <UnavailablePlayersAlert selectedTrainingBlock={selectedTrainingBlock} assignedPlayers={assignedPlayers} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={confirmAssignments}>Save Training Block</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTrainingBlockDialog;
