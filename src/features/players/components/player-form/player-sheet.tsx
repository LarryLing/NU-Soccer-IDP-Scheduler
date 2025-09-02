import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { UsePlayersSheetReturn } from "../../hooks/use-player-sheet";
import PlayerForm from "./player-form";

type PlayerSheetProps = Pick<UsePlayersSheetReturn, "playerMetadata" | "isPlayerSheetOpen" | "setIsPlayerSheetOpen">;

const PlayerSheet = ({ playerMetadata, isPlayerSheetOpen, setIsPlayerSheetOpen }: PlayerSheetProps) => {
  return (
    <Sheet open={isPlayerSheetOpen} onOpenChange={setIsPlayerSheetOpen}>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>{playerMetadata ? "Edit Player" : "Add Player"}</SheetTitle>
          <SheetDescription>
            {playerMetadata ? "Edit the selected player." : "Add a new player to the table."}
          </SheetDescription>
        </SheetHeader>
        <PlayerForm />
      </SheetContent>
    </Sheet>
  );
};

export default PlayerSheet;
