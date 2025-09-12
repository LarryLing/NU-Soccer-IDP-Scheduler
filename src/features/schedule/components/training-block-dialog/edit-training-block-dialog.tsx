import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePlayersActions } from "@/features/players/hooks/use-players-store";
import { getTimeStringWithMeridian } from "@/lib/time";
import type { Player } from "@/schemas/player.schema";

import type { UseTrainingBlockDialogReturn } from "../../hooks/use-training-block-dialog";

import TrainingBlockDialogAssignedPlayersList from "./training-block-dialog-assigned-players-list";
import TrainingBlockDialogSearchPlayersCombobox from "./training-block-dialog-search-players-combobox";
import UnavailablePlayersAlert from "./unavailable-players-alert";

type EditTrainingBlockDialogProps = Pick<
  UseTrainingBlockDialogReturn,
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
  const { assignPlayersToTrainingBlocks } = usePlayersActions();

  if (!selectedTrainingBlock) return null;

  const { day, start, end } = selectedTrainingBlock;

  const deleteTrainingBlock = () => {
    if (!selectedTrainingBlock) return;

    const assignments: Record<Player["id"], Player["trainingBlockId"]> = {};
    assignedPlayers.forEach((assignedPlayer) => (assignments[assignedPlayer.id] = null));
    assignPlayersToTrainingBlocks(assignments);

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
        <TrainingBlockDialogSearchPlayersCombobox
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
          <Button variant="destructive" onClick={deleteTrainingBlock}>
            Delete Training Block
          </Button>
          <Button onClick={confirmAssignments}>Save Training Block</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTrainingBlockDialog;
