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
import type {
  Availability,
  PlayerSheetForm,
  UsePlayersReturn,
  UsePlayersSheetReturn,
} from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { formatTimeWithPeriod, parseTime } from "@/lib/utils";
import AvailabilityDay from "./availability-day";
import ErrorAlert from "../misc/error-alert";

type PlayerSheetProps = Pick<
  UsePlayersSheetReturn,
  | "form"
  | "playerMetadata"
  | "isPlayerSheetOpen"
  | "error"
  | "setError"
  | "setIsPlayerSheetOpen"
  | "fieldArray"
  | "addAvailability"
> &
  Pick<UsePlayersReturn, "insertPlayer" | "updatePlayer">;

export default function PlayerSheet({
  form,
  playerMetadata,
  isPlayerSheetOpen,
  setIsPlayerSheetOpen,
  error,
  setError,
  fieldArray: { fields, remove },
  addAvailability,
  insertPlayer,
  updatePlayer,
}: PlayerSheetProps) {
  const { user } = useAuth();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValidating },
  } = form;

  const onSubmit: SubmitHandler<PlayerSheetForm> = async (data) => {
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

    for (let i = 0; i < DAYS.length; i++) {
      const day = DAYS[i];
      const dayAvailabilities = sortedAvailabilities.filter(
        (availability) => availability.day === day,
      );

      for (let i = 1; i < dayAvailabilities.length; i++) {
        const previous = dayAvailabilities[i - 1];
        const current = dayAvailabilities[i];

        if (previous && current && previous.end_int > current.start_int) {
          setError(
            `Time overlap detected on ${day}: ${formatTimeWithPeriod(previous.start_int)} - ${formatTimeWithPeriod(previous.end_int)} overlaps with ${formatTimeWithPeriod(current.start_int)} - ${formatTimeWithPeriod(current.end_int)}`,
          );
          return;
        }
      }
    }

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
                  <AvailabilityDay
                    key={day}
                    day={day}
                    dayFields={dayFields}
                    addAvailability={addAvailability}
                    remove={remove}
                    control={control}
                  />
                );
              })}
              {error && <ErrorAlert message={error} />}
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
}
