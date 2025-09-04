import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { UseEditPlayerSheetReturn } from "../../hooks/use-edit-player-sheet";
import EditPlayerForm from "./edit-player-form";

type EditPlayerSheetProps = Pick<
  UseEditPlayerSheetReturn,
  "player" | "isEditPlayerSheetOpen" | "setIsEditPlayerSheetOpen"
>;

const EditPlayerSheet = ({ player, isEditPlayerSheetOpen, setIsEditPlayerSheetOpen }: EditPlayerSheetProps) => {
  return (
    <Sheet open={isEditPlayerSheetOpen} onOpenChange={setIsEditPlayerSheetOpen}>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Edit Player</SheetTitle>
          <SheetDescription>Edit the selected player.</SheetDescription>
        </SheetHeader>
        <EditPlayerForm player={player} />
      </SheetContent>
    </Sheet>
  );
};

export default EditPlayerSheet;
