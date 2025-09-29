import { useState } from "react";

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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  const [filters, setFilters] = useState<string[]>(["available"]);

  if (!selectedTrainingBlock) return null;

  const { day, start, end } = selectedTrainingBlock;

  const handleSetFilter = (values: string[]) => {
    setFilters(values);
  };

  return (
    <Dialog open={isTrainingBlockDialogOpen} onOpenChange={setIsTrainingBlockDialogOpen}>
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">Edit Training Block</DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            {day} • {getTimeStringWithMeridian(start)} - {getTimeStringWithMeridian(end)} • {assignedPlayers.length}{" "}
            Players
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Filter Player Search</h3>
            <ToggleGroup type="multiple" value={filters} onValueChange={handleSetFilter} variant="outline">
              <ToggleGroupItem value="available" className="w-[110px] hover:bg-background">
                Available
              </ToggleGroupItem>
              <ToggleGroupItem value="unassigned" className="w-[110px] hover:bg-background">
                Unassigned
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <SearchPlayersCombobox
            filters={filters}
            selectedTrainingBlock={selectedTrainingBlock}
            assignedPlayers={assignedPlayers}
            addAssignment={addAssignment}
          />
        </div>
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
