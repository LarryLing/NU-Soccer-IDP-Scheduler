import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UseTrainingBlockDialogReturn } from "@/lib/types";
import { Calendar, Clock } from "lucide-react";

type TrainingBlockDialogProps = Pick<
  UseTrainingBlockDialogReturn,
  "dialogConfig" | "isTrainingBlockDialogOpen" | "setIsTrainingBlockDialogOpen"
>;

export default function TrainingBlockDialog({
  dialogConfig,
  isTrainingBlockDialogOpen,
  setIsTrainingBlockDialogOpen,
}: TrainingBlockDialogProps) {
  return (
    <Dialog open={isTrainingBlockDialogOpen} onOpenChange={setIsTrainingBlockDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            <Calendar />
            {dialogConfig?.day}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <Clock className="size-4" />
            {dialogConfig?.start} - {dialogConfig?.end}
          </DialogDescription>
          {dialogConfig?.assignedPlayerNames.length === 0 ? (
            <i className="text-sm text-muted-foreground">No players assigned</i>
          ) : (
            <div className="space-y-1">
              {dialogConfig?.assignedPlayerNames.map((assignedPlayerName) => (
                <p key={assignedPlayerName} className="text-sm">
                  {" "}
                  - {assignedPlayerName}
                </p>
              ))}
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
