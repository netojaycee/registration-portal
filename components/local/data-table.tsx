"use client";
import * as React from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserRow } from "./user-table-columns";

interface DataTableProps {
  columns: any;
  data: UserRow[];
  selected: string[];
  totalCount: number;
  isLoading: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onAccredit: (id: string) => void;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number, pageSize: number) => void;
}

export function DataTable({
  columns,
  data,
  selected,
  totalCount,
  isLoading,
  onSelect,
  onSelectAll,
  onAccredit,
  pageIndex,
  pageSize,
  onPageChange,
}: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-xl border bg-white dark:bg-zinc-900 shadow-lg overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, idx) => (
              <TableRow key={`skeleton-${idx}`}>
                {columns.map((_: any, ci: any) => (
                  <TableCell key={`skeleton-cell-${idx}-${ci}`}>
                    <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={selected.includes(row.original.id) ? "selected" : undefined}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-zinc-400">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination controls */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-zinc-50 dark:bg-zinc-900">
        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          Page {pageIndex + 1} of {Math.max(1, Math.ceil(totalCount / pageSize))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (pageIndex > 0) onPageChange(pageIndex - 1, pageSize);
            }}
            disabled={pageIndex <= 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
              if (pageIndex + 1 < totalPages) onPageChange(pageIndex + 1, pageSize);
            }}
            disabled={pageIndex + 1 >= Math.max(1, Math.ceil(totalCount / pageSize))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
