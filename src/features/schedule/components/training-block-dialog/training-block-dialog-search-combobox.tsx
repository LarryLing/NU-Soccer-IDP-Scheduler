import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePlayers } from "@/features/players/hooks/use-players-store";

import type { UseTrainingBlockDialogReturn } from "../../hooks/use-training-block-dialog";
import { isPlayerAvailableForTrainingBlock } from "../../lib/schedule";

import TrainingBlockDialogSearchItem from "./training-block-dialog-search-item";

type TrainingBlockDialogSearchComboboxProps = Pick<
  UseTrainingBlockDialogReturn,
  "selectedTrainingBlock" | "assignedPlayers" | "addAssignment"
>;

const TrainingBlockDialogSearchCombobox = ({
  selectedTrainingBlock,
  assignedPlayers,
  addAssignment,
}: TrainingBlockDialogSearchComboboxProps) => {
  const [open, setOpen] = useState(false);

  const players = usePlayers();

  if (!selectedTrainingBlock) return null;

  const handleAssignPlayer = (value: string) => {
    addAssignment(value);
    setOpen(false);
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          Assign Player...
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search Players..." />
          <CommandList>
            <CommandEmpty>No players found.</CommandEmpty>
            <CommandGroup className="overflow-y-scroll">
              {players.map((player) => {
                if (assignedPlayers.some((assignedPlayer) => assignedPlayer.id === player.id)) {
                  return null;
                }

                return (
                  <CommandItem key={player.id} value={player.name} onSelect={handleAssignPlayer}>
                    <TrainingBlockDialogSearchItem
                      isPlayerAvailable={isPlayerAvailableForTrainingBlock(player, selectedTrainingBlock)}
                      isPlayerAssigned={
                        player.trainingBlockId !== null && player.trainingBlockId !== selectedTrainingBlock.id
                      }
                      {...player}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TrainingBlockDialogSearchCombobox;
