import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { CalendarIcon, PlusIcon } from "lucide-react";

type ActionBarProps = {
  display: "players" | "schedule";
  setDisplay: (display: "players" | "schedule") => void;
};

export default function ActionBar({ display, setDisplay }: ActionBarProps) {
  return (
    <div className="w-full flex justify-between items-center">
      {display === "players" && (
        <Button>
          <PlusIcon />
          Add Player
        </Button>
      )}
      {display === "schedule" && (
        <Button>
          <CalendarIcon />
          Create Schedule
        </Button>
      )}
      <Tabs
        defaultValue={display}
        onValueChange={(value) => setDisplay(value as "players" | "schedule")}
      >
        <TabsList>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
