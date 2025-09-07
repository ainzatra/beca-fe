import React, { useMemo, useState, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

type ResponseRecord = {
  id: string;
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  createdAt?: string | null;
  [k: string]: any;
};

type Props = {
  responses: ResponseRecord[];
  initialPageSize?: number;
};

export default function ResponsesTable({
  responses,
  initialPageSize = 10,
}: Props) {
  const columns = useMemo<ColumnDef<ResponseRecord, any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => info.getValue() ?? '—',
      },
      {
        accessorKey: 'address',
        header: 'Address',
        cell: (info) => info.getValue() ?? '—',
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: (info) => info.getValue() ?? '—',
      },
      {
        accessorKey: 'createdAt',
        header: 'Date submitted',
        cell: (info) => {
          const v = info.getValue() as string | null | undefined;
          return v ? new Date(v).toLocaleString() : '—';
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const id = row.original.id;
          return (
            <a
              className="text-sm text-primary underline"
              href={`/response/${id}`}
            >
              View
            </a>
          );
        },
      },
    ],
    [],
  );

  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const table = useReactTable({
    data: responses,
    columns,
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex ?? 0);
      setPageSize(next.pageSize ?? pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });

  const pageCount = table.getPageCount();
  const current = table.getState().pagination.pageIndex;

  useEffect(() => {
    const maxIndex = Math.max(0, pageCount - 1);
    if (pageIndex > maxIndex) {
      setPageIndex(maxIndex);
    }
  }, [pageCount, pageIndex]);

  // small pager renderer (shows up to 5 pages with ellipsis)
  const pagerItems = useMemo(() => {
    const out: (number | '...')[] = [];
    const total = pageCount;
    if (total <= 7) {
      for (let i = 0; i < total; i++) out.push(i);
      return out;
    }
    // always include first, last, current vicinity
    out.push(0);
    const left = Math.max(1, current - 1);
    const right = Math.min(total - 2, current + 1);

    if (left > 1) out.push('...');

    for (let i = left; i <= right; i++) out.push(i);

    if (right < total - 2) out.push('...');

    out.push(total - 1);
    return out;
  }, [pageCount, current]);

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <tr>
            {table
              .getHeaderGroups()
              .map((hg) =>
                hg.headers.map((h) => (
                  <TableHead key={h.id as string}>
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                )),
              )}
          </tr>
        </TableHeader>

        <TableBody>
          {table.getPaginationRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination aria-label="Responses pagination" className="pt-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => table.getCanPreviousPage() && table.previousPage()}
              aria-disabled={!table.getCanPreviousPage()}
            />
          </PaginationItem>

          {pagerItems.map((p, idx) =>
            p === '...' ? (
              <PaginationItem key={`e-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === current}
                  onClick={() => table.setPageIndex(Number(p))}
                >
                  {Number(p) + 1}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => table.getCanNextPage() && table.nextPage()}
              aria-disabled={!table.getCanNextPage()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="text-sm text-muted-foreground">
        Showing page {current + 1} of {pageCount} — {responses.length} responses
      </div>
    </div>
  );
}
