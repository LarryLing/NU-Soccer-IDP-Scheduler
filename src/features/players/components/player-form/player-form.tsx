import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DAYS } from "@/constants/days";
import { POSITIONS } from "@/constants/positions";
import AvailabilityDay from "./availability-day";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePlayerForm } from "../../hooks/use-player-form";

const PlayerForm = () => {
  const { form, fieldArray, onSubmit, addAvailability } = usePlayerForm();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValidating },
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
                  <Input type="number" min={0} max={99} step={1} placeholder="Enter player number" {...field} />
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
        </div>
        <SheetFooter>
          <Button type="submit" disabled={isSubmitting || isValidating}>
            Save Player
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting || isValidating}>
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
};

export default PlayerForm;
