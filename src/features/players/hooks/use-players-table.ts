import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type Table,
} from "@tanstack/react-table";
import { useState } from "react";

import type { Player } from "@/schemas/player.schema";

import { usePlayers } from "./use-players-store";

export type UsePlayersTableReturn = {
  table: Table<Player>;
};

export const usePlayersTable = (columns: ColumnDef<Player>[]): UsePlayersTableReturn => {
  const players = usePlayers();

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "number",
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: players,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return { table };
};
