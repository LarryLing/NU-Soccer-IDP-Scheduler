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

import type { UseTrainingBlockDialogType } from "../../hooks/use-training-block-dialog";

import TrainingBlockDialogPlayerItem from "./training-block-dialog-player-item";

type TrainingBlockDialogProps = Pick<
  UseTrainingBlockDialogType,
  | "isTrainingBlockDialogOpen"
  | "setIsTrainingBlockDialogOpen"
  | "selectedTrainingBlock"
  | "assignedPlayers"
  | "unassignPlayer"
  | "deleteTrainingBlock"
>;

const TrainingBlockDialog = ({
  isTrainingBlockDialogOpen,
  setIsTrainingBlockDialogOpen,
  selectedTrainingBlock,
  assignedPlayers,
  unassignPlayer,
  deleteTrainingBlock,
}: TrainingBlockDialogProps) => {
  if (!selectedTrainingBlock) return null;

  const { day, start, end } = selectedTrainingBlock;

  return (
    <Dialog open={isTrainingBlockDialogOpen} onOpenChange={setIsTrainingBlockDialogOpen}>
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">{day}</DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            {getTimeStringWithMeridian(start)} - {getTimeStringWithMeridian(end)}
          </DialogDescription>
        </DialogHeader>
        <div>
          <h3 className="text-md font-medium mb-2">Assigned Players</h3>
          <div className="flex flex-col gap-2 max-h-[185px] overflow-y-scroll">
            {assignedPlayers.map((assignedPlayer) => (
              <TrainingBlockDialogPlayerItem
                key={assignedPlayer.id}
                player={assignedPlayer}
                trainingBlock={selectedTrainingBlock}
                unassignPlayer={unassignPlayer}
              />
            ))}
          </div>
        </div>
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
