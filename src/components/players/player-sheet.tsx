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
import { DAYS, POSITIONS } from "@/lib/constants";
import type { UsePlayersSheetReturn } from "@/lib/types";
import AvailabilityDay from "./availability-day";
import ErrorAlert from "../misc/error-alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

type PlayerSheetProps = Pick<
  UsePlayersSheetReturn,
  | "form"
  | "playerMetadata"
  | "isPlayerSheetOpen"
  | "setIsPlayerSheetOpen"
  | "error"
  | "fieldArray"
  | "addAvailability"
  | "onSubmit"
>;

export default function PlayerSheet({
  form,
  playerMetadata,
  isPlayerSheetOpen,
  setIsPlayerSheetOpen,
  error,
  fieldArray: { fields, remove },
  addAvailability,
  onSubmit,
}: PlayerSheetProps) {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValidating },
  } = form;

  return (
    <Sheet open={isPlayerSheetOpen} onOpenChange={setIsPlayerSheetOpen}>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>{playerMetadata ? "Edit Player" : "Add Player"}</SheetTitle>
          <SheetDescription>
            {playerMetadata ? "Edit the selected player." : "Add a new player to the table."}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Button type="button" variant="outline" disabled={isSubmitting || isValidating}>
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
