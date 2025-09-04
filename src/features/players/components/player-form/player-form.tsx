import { Button } from "@/components/ui/button";
import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { DAYS } from "@/constants/days";
import { POSITIONS } from "@/features/players/constants/positions";
import type { Player } from "@/types/player.type";

import { usePlayerForm } from "../../hooks/use-player-form";
import type { UsePlayerSheetReturn } from "../../hooks/use-player-sheet";

import PlayerFormAvailabilityFieldArray from "./player-form-availability-field-array";

type PlayerFormProps = {
  player?: Player;
  closePlayerSheet: UsePlayerSheetReturn["closePlayerSheet"];
};

const PlayerForm = ({ player, closePlayerSheet }: PlayerFormProps) => {
  const { form, fieldArray, onSubmit, addAvailability } = usePlayerForm(closePlayerSheet, player);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { fields, remove } = fieldArray;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6 px-4 mb-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter player name" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={99}
                    step={1}
                    placeholder="Enter player number"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    {POSITIONS.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {DAYS.map((day) => {
            const dayFields = fields
              .map((field, idx) => ({ ...field, originalIndex: idx }))
              .filter((field) => field.day === day);
            return (
              <PlayerFormAvailabilityFieldArray
                key={day}
                day={day}
                dayFields={dayFields}
                addAvailability={addAvailability}
                remove={remove}
                control={control}
                disabled={isSubmitting}
              />
            );
          })}
        </div>
        <SheetFooter>
          <Button type="submit" disabled={isSubmitting}>
            Save Player
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
};

export default PlayerForm;
