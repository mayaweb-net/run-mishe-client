"use client";

import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatMatrixValue,
  vendorLabel,
  type CpuMatrixResponse,
} from "@/config/cpu-list";

type CpuMatrixTableProps = {
  data: CpuMatrixResponse | null;
  loading: boolean;
  error: string | null;
};

export function CpuMatrixTable({
  data,
  loading,
  error,
}: CpuMatrixTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 rounded-2xl border bg-card p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Empty className="rounded-2xl border bg-card">
        <EmptyHeader>
          <EmptyTitle>{error}</EmptyTitle>
          <EmptyDescription>
            اتصال API سرور و دیتابیس را بررسی کنید.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (!data?.rows.length) {
    return (
      <Empty className="rounded-2xl border bg-card">
        <EmptyHeader>
          <EmptyTitle>پردازنده‌ای پیدا نشد</EmptyTitle>
          <EmptyDescription>
            فیلترها را تغییر دهید یا بعداً دوباره تلاش کنید.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky start-0 z-20 min-w-56 border-e bg-card">
              پردازنده
            </TableHead>
            {data.columns.map((column) => (
              <TableHead
                key={column.id}
                className="min-w-28 whitespace-nowrap text-center"
                title={column.name}
              >
                <span className="block max-w-36 truncate">
                  {column.nameFa || column.name}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((row) => (
            <TableRow key={row.cpu.id}>
              <TableCell className="sticky start-0 z-10 border-e bg-card">
                <div className="space-y-1.5">
                  <p className="font-medium leading-snug">{row.cpu.name}</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">
                      {vendorLabel(row.cpu.vendor)}
                    </Badge>
                    {row.cpu.socket ? (
                      <Badge variant="outline">{row.cpu.socket}</Badge>
                    ) : null}
                    {row.cpu.isX3d ? (
                      <Badge variant="outline">X3D</Badge>
                    ) : null}
                    {row.cpu.gamingIndex != null ? (
                      <Badge variant="outline">
                        Index {Math.round(row.cpu.gamingIndex)}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </TableCell>
              {row.values.map((value, index) => (
                <TableCell
                  key={`${row.cpu.id}-${data.columns[index]?.id ?? index}`}
                  className="text-center tabular-nums"
                >
                  {formatMatrixValue(value)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
