import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { UseCreateTrainingBlockDialogReturn } from "../../hooks/use-create-training-block-dialog";
import useScheduleStore from "../../hooks/use-schedule-store";

import TrainingBlockDialogSelectItem from "./training-block-dialog-select-item";

type TrainingBlockDialogSelectComboboxProps = Pick<UseCreateTrainingBlockDialogReturn, "selectTrainingBlock">;

const TrainingBlockDialogSelectCombobox = ({ selectTrainingBlock }: TrainingBlockDialogSelectComboboxProps) => {
  const [open, setOpen] = useState(false);

  const trainingBlocks = useScheduleStore((state) => state.trainingBlocks);

  const filteredTrainingBlocks = trainingBlocks.filter((trainingBlock) => trainingBlock.assignedPlayerCount === 0);

  const handleSelectTrainingBlock = (value: string) => {
    selectTrainingBlock(value);
    setOpen(false);
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          Select Training Block...
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search Training Blocks..." />
          <CommandList>
            <CommandEmpty>No training blocks found.</CommandEmpty>
            <CommandGroup className="overflow-y-scroll">
              {filteredTrainingBlocks.map((trainingBlock) => (
                <CommandItem key={trainingBlock.id} value={trainingBlock.id} onSelect={handleSelectTrainingBlock}>
                  <TrainingBlockDialogSelectItem {...trainingBlock} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TrainingBlockDialogSelectCombobox;
