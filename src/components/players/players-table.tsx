import type {
  Player,
  UsePlayersReturn,
  UsePlayersSheetReturn,
} from "@/lib/types";
import { flexRender } from "@tanstack/react-table";
import type { Table as TanstackTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ActionContextMenu } from "./action-context-menu";

type PlayersTableProps = {
  table: TanstackTable<Player>;
  numColumns: number;
  deletePlayer: UsePlayersReturn["deletePlayer"];
  openPlayerSheet: UsePlayersSheetReturn["openPlayerSheet"];
};

export function PlayersTable({
  table,
  numColumns,
  deletePlayer,
  openPlayerSheet,
}: PlayersTableProps) {
  return (
    <div className="border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <ActionContextMenu
                key={row.id}
                id={row.original.id}
                deletePlayer={deletePlayer}
                openPlayerSheet={openPlayerSheet}
              >
                <TableRow data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </ActionContextMenu>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={numColumns} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
