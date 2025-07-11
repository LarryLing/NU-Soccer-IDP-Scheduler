import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { Player } from "@/lib/types";

type PlayerSheetProps = {
  isPlayerSheetOpen: boolean;
  setIsPlayerSheetOpen: (isPlayerSheetOpen: boolean) => void;
  playerToEdit: Player | null;
};

export default function PlayerSheet({
  isPlayerSheetOpen,
  setIsPlayerSheetOpen,
  playerToEdit,
}: PlayerSheetProps) {
  return (
    <Sheet open={isPlayerSheetOpen} onOpenChange={setIsPlayerSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{playerToEdit ? "Edit Player" : "Add Player"}</SheetTitle>
          <SheetDescription>
            {playerToEdit
              ? "Edit the selected player."
              : "Add a new player to the table."}
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input
              id="sheet-demo-name"
              defaultValue={playerToEdit?.name ?? ""}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-number">Number</Label>
            <Input
              id="sheet-demo-number"
              defaultValue={playerToEdit?.number ?? ""}
            />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">
            {playerToEdit ? "Save Player" : "Add Player"}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
