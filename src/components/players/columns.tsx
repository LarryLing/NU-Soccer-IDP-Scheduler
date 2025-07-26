import type { Player, Availability, UsePlayersReturn, UsePlayersSheetReturn } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { DAYS } from "@/lib/constants";
import AvailabilityPopover from "./availability-popover";
import ActionDropdownMenu from "./action-dropdown-menu";

export default function getColumns(deletePlayer: UsePlayersReturn["deletePlayer"], openPlayerSheet: UsePlayersSheetReturn["openPlayerSheet"]): ColumnDef<Player>[] {
  return [
    {
      accessorKey: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selected row"
        />
      ),
      enableSorting: false,
    },
    {
      id: "number",
      accessorKey: "number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Number
            <ArrowDownUpIcon size={15} />
          </Button>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowDownUpIcon size={15} />
          </Button>
        );
      },
    },
    {
      accessorKey: "position",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Position
            <ArrowDownUpIcon size={15} />
          </Button>
        );
      },
      cell: ({ row }) => {
        const position: Player["position"] = row.getValue("position");
        return <Badge variant="outline">{position}</Badge>;
      },
    },
    {
      accessorKey: "availabilities",
      header: "Availabilities",
      cell: ({ row }) => {
        const availabilities: Availability[] = row.getValue("availabilities");
        return DAYS.map((day) => {
          const dayAvailabilities = availabilities.filter((availability) => availability.day === day);
          if (dayAvailabilities.length === 0) return null;
          return <AvailabilityPopover key={day} day={day} dayAvailabilities={dayAvailabilities} />;
        });
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionDropdownMenu id={row.original.id} deletePlayer={deletePlayer} openPlayerSheet={openPlayerSheet}/>
      ),
    },
  ];
}
