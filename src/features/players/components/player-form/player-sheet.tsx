import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { UsePlayerSheetReturn } from "../../hooks/use-player-sheet";
import PlayerForm from "./player-form";

type PlayerSheetProps = Pick<
  UsePlayerSheetReturn,
  "player" | "isPlayerSheetOpen" | "setIsPlayerSheetOpen" | "closePlayerSheet"
>;

const PlayerSheet = ({ player, isPlayerSheetOpen, setIsPlayerSheetOpen, closePlayerSheet }: PlayerSheetProps) => {
  return (
    <Sheet open={isPlayerSheetOpen} onOpenChange={setIsPlayerSheetOpen}>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>{player ? "Edit Player" : "Add Player"}</SheetTitle>
          <SheetDescription>{player ? "Edit the selected player." : "Add a new player."}</SheetDescription>
        </SheetHeader>
        <PlayerForm player={player} closePlayerSheet={closePlayerSheet} />
      </SheetContent>
    </Sheet>
  );
};

export default PlayerSheet;
