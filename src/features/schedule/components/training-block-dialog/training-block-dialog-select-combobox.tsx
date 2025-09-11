import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePlayers } from "@/features/players/hooks/use-players-store";

import { useTrainingBlocks, useScheduleActions } from "../../hooks/use-schedule-store";
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

  const players = usePlayers();
  const trainingBlocks = useTrainingBlocks();

  const { getTrainingBlockById } = useScheduleActions();

  const filteredTrainingBlocks = trainingBlocks.filter(
    (trainingBlock) => !players.some((player) => player.trainingBlockId === trainingBlock.id)
  );

  const handleSelectTrainingBlock = (value: string) => {
    setSelectedTrainingBlock(getTrainingBlockById(value));
    setOpen(false);
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedTrainingBlock ? (
            <TrainingBlockDialogSelectItem {...selectedTrainingBlock} />
          ) : (
            <>
              <span>Select Training Block...</span>
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No training blocks found. Please make sure field availabilities have been set.</CommandEmpty>
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
