import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddPlayerForm from "./add-player-form";

const AddPlayerSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon />
          Add Player
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Add Player</SheetTitle>
          <SheetDescription>Add a new player to the table.</SheetDescription>
        </SheetHeader>
        <AddPlayerForm />
      </SheetContent>
    </Sheet>
  );
};

export default AddPlayerSheet;
