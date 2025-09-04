import type { Player } from "@/types/player.type";
import type { Availability } from "@/types/availability.type";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DAYS } from "@/constants/days";
import PlayersTableAvailabilityPopover from "../components/players-table/players-table-availability-popover";
import PlayersTableActionDropdownMenu from "../components/players-table/players-table-action-dropdown-menu";
import type { UsePlayerSheetReturn } from "../hooks/use-player-sheet";

const getColumns = (openPlayerSheet: UsePlayerSheetReturn["openPlayerSheet"]): ColumnDef<Player>[] => {
  return [
    {
      accessorKey: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
          return <PlayersTableAvailabilityPopover key={day} day={day} dayAvailabilities={dayAvailabilities} />;
        });
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <PlayersTableActionDropdownMenu id={row.original.id} openPlayerSheet={openPlayerSheet} />,
    },
  ];
};

export default getColumns;
