"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CpuListFilters } from "@/components/parts/cpu/cpu-list-filters";
import { CpuMatrixTable } from "@/components/parts/cpu/cpu-matrix-table";
import { Button } from "@/components/ui/button";
import {
  fetchCpuMatrix,
  type CpuMatrixQuery,
  type CpuMatrixResponse,
} from "@/config/cpu-list";

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseNumber(value: string | null): number | undefined {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseQuery(searchParams: URLSearchParams): CpuMatrixQuery {
  return {
    page: parseNumber(searchParams.get("page")) ?? 1,
    limit: parseNumber(searchParams.get("limit")) ?? 25,
    q: searchParams.get("q") ?? undefined,
    vendor: searchParams.get("vendor") ?? undefined,
    formFactor: searchParams.get("formFactor") ?? "DESKTOP",
    socket: searchParams.get("socket") ?? undefined,
    family: searchParams.get("family") ?? undefined,
    isX3d: parseBoolean(searchParams.get("isX3d")),
    isUnlocked: parseBoolean(searchParams.get("isUnlocked")),
    sortBy: "gamingIndex",
    sortOrder: "desc",
  };
}

function toSearchParams(query: CpuMatrixQuery) {
  const params = new URLSearchParams();
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.limit && query.limit !== 25) params.set("limit", String(query.limit));
  if (query.q) params.set("q", query.q);
  if (query.vendor) params.set("vendor", query.vendor);
  if (query.formFactor && query.formFactor !== "DESKTOP") {
    params.set("formFactor", query.formFactor);
  }
  if (query.socket) params.set("socket", query.socket);
  if (query.family) params.set("family", query.family);
  if (query.isX3d != null) params.set("isX3d", String(query.isX3d));
  if (query.isUnlocked != null) {
    params.set("isUnlocked", String(query.isUnlocked));
  }
  return params;
}

export function CpuListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = useMemo(() => parseQuery(searchParams), [searchParams]);

  const [data, setData] = useState<CpuMatrixResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQ, setDebouncedQ] = useState(query.q);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQ(query.q), 250);
    return () => window.clearTimeout(timer);
  }, [query.q]);

  function updateQuery(patch: Partial<CpuMatrixQuery>) {
    const next = { ...query, ...patch };
    const params = toSearchParams(next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchCpuMatrix({
          ...query,
          q: debouncedQ,
        });
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) {
          setError("بارگذاری لیست پردازنده‌ها با خطا مواجه شد.");
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
    // Intentionally omit `query` / `query.q`: search text is debounced via `debouncedQ`.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce q separately
  }, [
    debouncedQ,
    query.page,
    query.limit,
    query.vendor,
    query.formFactor,
    query.socket,
    query.family,
    query.isX3d,
    query.isUnlocked,
    query.sortBy,
    query.sortOrder,
  ]);

  const meta = data?.meta;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">پردازنده‌ها</h1>
        <p className="text-sm text-muted-foreground">
          مقایسه امتیاز بنچمارک PassMark روی پردازنده‌ها
        </p>
      </div>

      <CpuListFilters query={query} onChange={updateQuery} />

      <CpuMatrixTable data={data} loading={loading} error={error} />

      {meta && meta.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            صفحه {meta.page} از {meta.totalPages} ·{" "}
            {meta.total.toLocaleString("fa-IR")} پردازنده
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={meta.page <= 1 || loading}
              onClick={() => updateQuery({ page: meta.page - 1 })}
            >
              <ChevronRight />
              قبلی
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages || loading}
              onClick={() => updateQuery({ page: meta.page + 1 })}
            >
              بعدی
              <ChevronLeft />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
