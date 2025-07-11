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
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type z from "zod";
import type { PlayerFormSchema } from "@/lib/schemas";
import { POSITIONS } from "@/lib/constants";
import type { Player, PlayerMetadata } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

type FormSchema = z.infer<typeof PlayerFormSchema>;

type PlayerSheetProps = {
  isPlayerSheetOpen: boolean;
  setIsPlayerSheetOpen: (isPlayerSheetOpen: boolean) => void;
  form: UseFormReturn<FormSchema>;
  playerMetadata: PlayerMetadata | null;
  insertPlayer: (player: Player) => Promise<void>;
  updatePlayer: (player: Player) => Promise<void>;
};

export default function PlayerSheet({
  isPlayerSheetOpen,
  setIsPlayerSheetOpen,
  form,
  playerMetadata,
  insertPlayer,
  updatePlayer,
}: PlayerSheetProps) {
  const { user } = useAuth();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValidating },
  } = form;

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    if (!user) return;

    if (!playerMetadata) {
      await insertPlayer({
        id: crypto.randomUUID(),
        user_id: user.id,
        training_block_id: null,
        ...data,
      });
    } else {
      await updatePlayer({
        ...playerMetadata,
        ...data,
      });
    }

    setIsPlayerSheetOpen(false);
  };

  return (
    <Sheet open={isPlayerSheetOpen} onOpenChange={setIsPlayerSheetOpen}>
      <SheetContent>
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
            <div className="space-y-4 px-4 mb-4">
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
