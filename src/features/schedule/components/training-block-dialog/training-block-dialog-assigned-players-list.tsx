import { ScrollArea } from "@/components/ui/scroll-area";
import type { Player } from "@/schemas/player.schema";
import type { TrainingBlock } from "@/schemas/training-block.schema";

import TrainingBlockDialogAssignedPlayersItem from "./training-block-dialog-assigned-players-item";

type TrainingBlockDialogAssignedPlayersListProps = {
  selectedTrainingBlock: TrainingBlock | null;
  assignedPlayers: Player[];
  unassignPlayer: (playerName: Player["name"]) => void;
};

const TrainingBlockDialogAssignedPlayersList = ({
  selectedTrainingBlock,
  assignedPlayers,
  unassignPlayer,
}: TrainingBlockDialogAssignedPlayersListProps) => {
  if (!selectedTrainingBlock) return null;

  return (
    <div>
      <h3 className="text-md font-medium mb-2">Assigned Players</h3>
      <ScrollArea>
        <div className="flex flex-col gap-2 max-h-[185px] pr-3">
          {assignedPlayers.map((assignedPlayer) => (
            <TrainingBlockDialogAssignedPlayersItem
              key={assignedPlayer.id}
              {...assignedPlayer}
              trainingBlockId={selectedTrainingBlock.id}
              unassignPlayer={unassignPlayer}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TrainingBlockDialogAssignedPlayersList;
