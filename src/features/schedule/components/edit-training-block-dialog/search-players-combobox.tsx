import { ChevronsUpDownIcon } from "lucide-react";
import { useState, type JSX } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePlayers } from "@/features/players/hooks/use-players-store";

import type { UseEditTrainingBlockDialogReturn } from "../../hooks/use-edit-training-block-dialog";
import { isPlayerAvailableForTrainingBlock } from "../../lib/schedule";

import SearchPlayersItem from "./search-players-item";

type SearchPlayersComboboxProps = { filters: string[] } & Pick<
  UseEditTrainingBlockDialogReturn,
  "selectedTrainingBlock" | "assignedPlayers" | "addAssignment"
>;

const SearchPlayersCombobox = ({
  filters,
  selectedTrainingBlock,
  assignedPlayers,
  addAssignment,
}: SearchPlayersComboboxProps) => {
  const [open, setOpen] = useState(false);

  const players = usePlayers();

  if (!selectedTrainingBlock) return null;

  const handleAssignPlayer = (value: string) => {
    addAssignment(value);
    setOpen(false);
  };

  const commandGroupItems: JSX.Element[] = [];

  players.forEach((player) => {
    const isPlayerAvailable = isPlayerAvailableForTrainingBlock(player, selectedTrainingBlock);
    const isPlayerAssigned = player.trainingBlockId !== null && player.trainingBlockId !== selectedTrainingBlock.id;

    if (assignedPlayers.some((assignedPlayer) => assignedPlayer.id === player.id)) return;

    if (filters.some((filter) => filter === "available") && !isPlayerAvailable) {
      return;
    }

    if (filters.some((filter) => filter === "unassigned") && isPlayerAssigned) {
      return;
    }

    commandGroupItems.push(
      <CommandItem key={player.id} value={player.name} onSelect={handleAssignPlayer}>
        <SearchPlayersItem isPlayerAvailable={isPlayerAvailable} isPlayerAssigned={isPlayerAssigned} {...player} />
      </CommandItem>
    );
  });

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
            <CommandGroup>{commandGroupItems}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchPlayersCombobox;
