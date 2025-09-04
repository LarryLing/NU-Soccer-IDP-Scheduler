import type { Player } from "@/types/player.type";
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
import usePlayersStore from "./use-players-store";

export type UsePlayersTableReturn = {
  table: Table<Player>;
};

export const usePlayersTable = (columns: ColumnDef<Player>[]): UsePlayersTableReturn => {
  const players = usePlayersStore((state) => state.players);

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
