import type { Player, Availability } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { formatTimeWithPeriod } from "@/lib/utils";

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
      return availabilities.map((availability, index) => (
        <Badge
          key={`${availability.day}.${availability.start}.${availability.end}.${index}`}
          variant="secondary"
          className="mr-2"
        >
          {availability.day} {formatTimeWithPeriod(availability.start_int)} -{" "}
          {formatTimeWithPeriod(availability.end_int)}
        </Badge>
      ));
    },
  },
];
