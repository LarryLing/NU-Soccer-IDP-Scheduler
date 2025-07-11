import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import type { SubmitHandler } from "react-hook-form";
import { DAYS, POSITIONS } from "@/lib/constants";
import type { Availability, PlayerSheetFormSchemaType } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { parseTime } from "@/lib/utils";
import AvailabilityDay from "./availability-day";
import { memo } from "react";
import { usePlayerSheet } from "@/hooks/usePlayerSheet";
import { usePlayers } from "@/hooks/usePlayers";

const PlayerSheet = memo(function PlayerSheet() {
  const { user } = useAuth();

  const { insertPlayer, updatePlayer } = usePlayers();

  const {
    isPlayerSheetOpen,
    setIsPlayerSheetOpen,
    form,
    fieldArray: { fields },
    playerMetadata,
  } = usePlayerSheet();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValidating },
  } = form;

  const onSubmit: SubmitHandler<PlayerSheetFormSchemaType> = async (data) => {
    if (!user) return;

    const sortedAvailabilities: Availability[] = data.availabilities
      .map((availability) => {
        return {
          ...availability,
          start_int: parseTime(availability.start),
          end_int: parseTime(availability.end),
        };
      })
      .sort((a, b) => a.start_int - b.start_int);

    if (!playerMetadata) {
      await insertPlayer({
        ...data,
        id: crypto.randomUUID(),
        user_id: user.id,
        training_block_id: null,
        availabilities: sortedAvailabilities,
      });
    } else {
      await updatePlayer({
        ...playerMetadata,
        ...data,
        availabilities: sortedAvailabilities,
      });
    }

    setIsPlayerSheetOpen(false);
  };

  return (
    <Sheet open={isPlayerSheetOpen} onOpenChange={setIsPlayerSheetOpen}>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>
            {playerMetadata ? "Edit Player" : "Add Player"}
          </SheetTitle>
          <SheetDescription>
            {playerMetadata
              ? "Edit the selected player."
              : "Add a new player to the table."}
          </SheetDescription>
        </SheetHeader>
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
                      <Input placeholder="Enter player name" {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                  <AvailabilityDay key={day} day={day} dayFields={dayFields} />
                );
              })}
            </div>
            <SheetFooter>
              <Button type="submit" disabled={isSubmitting || isValidating}>
                {playerMetadata ? "Save Player" : "Add Player"}
              </Button>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting || isValidating}
                >
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
});

export default PlayerSheet;
