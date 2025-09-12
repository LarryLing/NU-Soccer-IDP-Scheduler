import { ScrollArea } from "@/components/ui/scroll-area";

import type { UseEditTrainingBlockDialogReturn } from "../../hooks/use-edit-training-block-dialog";
import { isPlayerAvailableForTrainingBlock } from "../../lib/schedule";

import AssignedPlayersItem from "./assigned-players-item";

type AssignedPlayersListProps = Pick<
  UseEditTrainingBlockDialogReturn,
  "selectedTrainingBlock" | "assignedPlayers" | "removeAssignment"
>;

const AssignedPlayersList = ({
  selectedTrainingBlock,
  assignedPlayers,
  removeAssignment,
}: AssignedPlayersListProps) => {
  if (!selectedTrainingBlock) return null;

  return (
    <div>
      <h3 className="text-md font-medium mb-2">Assigned Players</h3>
      <ScrollArea>
        <div className="flex flex-col gap-2 max-h-[185px] pr-3">
          {assignedPlayers.length > 0 ? (
            assignedPlayers.map((assignedPlayer) => (
              <AssignedPlayersItem
                key={assignedPlayer.id}
                isPlayerAvailable={isPlayerAvailableForTrainingBlock(assignedPlayer, selectedTrainingBlock)}
                {...assignedPlayer}
                removeAssignment={removeAssignment}
              />
            ))
          ) : (
            <p className="text-sm font-medium text-muted-foreground">No players assigned...</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AssignedPlayersList;
