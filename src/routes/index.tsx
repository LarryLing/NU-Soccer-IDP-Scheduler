import ActionBar from "@/components/misc/action-bar";
import Navbar from "@/components/misc/navbar";
import { columns } from "@/components/players/columns";
import { PlayersTable } from "@/components/players/players-table";
import { usePlayers } from "@/hooks/usePlayers";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: Index,
});

function Index() {
  const { players } = usePlayers();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [display, setDisplay] = useState<"players" | "schedule">("players");

  const table = useReactTable({
    data: players || [],
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

  return (
    <div className="flex flex-col h-screen gap-y-4">
      <Navbar />
      <section className="sm:px-8 px-4">
        <ActionBar display={display} setDisplay={setDisplay} />
      </section>
      <section className="sm:px-8 px-4">
        {display === "players" && (
          <PlayersTable table={table} numColumns={columns.length} />
        )}
      </section>
    </div>
  );
}
