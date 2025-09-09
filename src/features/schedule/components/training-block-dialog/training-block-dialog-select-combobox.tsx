import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import useScheduleStore from "../../hooks/use-schedule-store";
import type { UseTrainingBlockDialogReturn } from "../../hooks/use-training-block-dialog";

import TrainingBlockDialogSelectItem from "./training-block-dialog-select-item";

type TrainingBlockDialogSelectComboboxProps = Pick<
  UseTrainingBlockDialogReturn,
  "selectedTrainingBlock" | "setSelectedTrainingBlock"
>;

const TrainingBlockDialogSelectCombobox = ({
  selectedTrainingBlock,
  setSelectedTrainingBlock,
}: TrainingBlockDialogSelectComboboxProps) => {
  const [open, setOpen] = useState(false);

  const trainingBlocks = useScheduleStore((state) => state.trainingBlocks);

  const filteredTrainingBlocks = trainingBlocks.filter((trainingBlock) => trainingBlock.assignedPlayerCount === 0);

  const handleSelectTrainingBlock = (value: string) => {
    setSelectedTrainingBlock(trainingBlocks.find((trainingBlock) => trainingBlock.id === value) || null);
    setOpen(false);
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {selectedTrainingBlock ? (
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-[50px]">
            <TrainingBlockDialogSelectItem {...selectedTrainingBlock} />
          </Button>
        ) : (
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-">
            Select Training Block...
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
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
