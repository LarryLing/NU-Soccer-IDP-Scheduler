import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import usePlayersStore from "@/features/players/hooks/use-players-store";

import type { UseTrainingBlockDialogReturn } from "../../hooks/use-training-block-dialog";

import TrainingBlockDialogSearchItem from "./training-block-dialog-search-item";

type TrainingBlockDialogSearchComboboxProps = Pick<
  UseTrainingBlockDialogReturn,
  "selectedTrainingBlock" | "assignedPlayers" | "assignPlayer"
>;

const TrainingBlockDialogSearchCombobox = ({
  selectedTrainingBlock,
  assignedPlayers,
  assignPlayer,
}: TrainingBlockDialogSearchComboboxProps) => {
  const [open, setOpen] = useState(false);

  const players = usePlayersStore((state) => state.players);

  const filteredPlayers = players.filter(
    (player) => !assignedPlayers.some((assignedPlayer) => assignedPlayer.id === player.id)
  );

  const handleAssignPlayer = (value: string) => {
    assignPlayer(value, selectedTrainingBlock!.id);
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
              {filteredPlayers.map((player) => (
                <CommandItem key={player.id} value={player.id} onSelect={handleAssignPlayer}>
                  <TrainingBlockDialogSearchItem player={player} trainingBlock={selectedTrainingBlock!} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TrainingBlockDialogSearchCombobox;
