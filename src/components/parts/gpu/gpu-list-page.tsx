"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GpuListFilters } from "@/components/parts/gpu/gpu-list-filters";
import { GpuMatrixTable } from "@/components/parts/gpu/gpu-matrix-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchGpuMatrix,
  type ApiResolution,
  type GpuMatrixMode,
  type GpuMatrixQuery,
  type GpuMatrixResponse,
  type QualityPreset,
} from "@/config/gpu-list";

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

function parseQuery(searchParams: URLSearchParams): GpuMatrixQuery {
  const mode =
    searchParams.get("mode") === "benchmark" ? "benchmark" : "fps";

  return {
    mode,
    page: parseNumber(searchParams.get("page")) ?? 1,
    limit: parseNumber(searchParams.get("limit")) ?? 25,
    q: searchParams.get("q") ?? undefined,
    vendor: searchParams.get("vendor") ?? undefined,
    formFactor: searchParams.get("formFactor") ?? "DESKTOP",
    family: searchParams.get("family") ?? undefined,
    vramMin: parseNumber(searchParams.get("vramMin")),
    vramMax: parseNumber(searchParams.get("vramMax")),
    supportsRayTracing: parseBoolean(searchParams.get("supportsRayTracing")),
    memoryType: searchParams.get("memoryType") ?? undefined,
    resolution:
      (searchParams.get("resolution") as ApiResolution | null) ?? "R1080P",
    preset: (searchParams.get("preset") as QualityPreset | null) ?? "HIGH",
    sortBy: "gamingIndex",
    sortOrder: "desc",
  };
}

function toSearchParams(query: GpuMatrixQuery) {
  const params = new URLSearchParams();
  if (query.mode !== "fps") params.set("mode", query.mode);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.limit && query.limit !== 25) params.set("limit", String(query.limit));
  if (query.q) params.set("q", query.q);
  if (query.vendor) params.set("vendor", query.vendor);
  if (query.formFactor && query.formFactor !== "DESKTOP") {
    params.set("formFactor", query.formFactor);
  }
  if (query.family) params.set("family", query.family);
  if (query.vramMin != null) params.set("vramMin", String(query.vramMin));
  if (query.vramMax != null) params.set("vramMax", String(query.vramMax));
  if (query.supportsRayTracing != null) {
    params.set("supportsRayTracing", String(query.supportsRayTracing));
  }
  if (query.memoryType) params.set("memoryType", query.memoryType);
  if (query.mode === "fps") {
    if (query.resolution && query.resolution !== "R1080P") {
      params.set("resolution", query.resolution);
    }
    if (query.preset && query.preset !== "HIGH") {
      params.set("preset", query.preset);
    }
  }
  return params;
}

export function GpuListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = useMemo(() => parseQuery(searchParams), [searchParams]);

  const [data, setData] = useState<GpuMatrixResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQ, setDebouncedQ] = useState(query.q);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQ(query.q), 250);
    return () => window.clearTimeout(timer);
  }, [query.q]);

  function updateQuery(patch: Partial<GpuMatrixQuery>) {
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
        const result = await fetchGpuMatrix({
          ...query,
          q: debouncedQ,
        });
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) {
          setError("بارگذاری لیست کارت‌های گرافیک با خطا مواجه شد.");
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
    query.mode,
    query.page,
    query.limit,
    query.vendor,
    query.formFactor,
    query.family,
    query.vramMin,
    query.vramMax,
    query.supportsRayTracing,
    query.memoryType,
    query.resolution,
    query.preset,
    query.sortBy,
    query.sortOrder,
  ]);

  const meta = data?.meta;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">کارت‌های گرافیک</h1>
          <p className="text-sm text-muted-foreground">
            مقایسه FPS بازی‌ها یا امتیاز بنچمارک‌ها روی کارت‌های گرافیک
          </p>
          {data?.mode === "fps" && data.cpu ? (
            <p className="text-xs text-muted-foreground">
              CPU مرجع: {data.cpu.name}
              {data.settings
                ? ` · ${data.settings.resolution.replace(/^R/, "").replace("P", "p")} / ${data.settings.preset}`
                : null}
            </p>
          ) : null}
        </div>

        <Tabs
          value={query.mode}
          onValueChange={(value) =>
            updateQuery({
              mode: (value as GpuMatrixMode) || "fps",
              page: 1,
            })
          }
        >
          <TabsList>
            <TabsTrigger value="fps">FPS</TabsTrigger>
            <TabsTrigger value="benchmark">بنچمارک</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <GpuListFilters query={query} onChange={updateQuery} />

      <GpuMatrixTable
        data={data}
        loading={loading}
        error={error}
      />

      {meta && meta.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            صفحه {meta.page} از {meta.totalPages} · {meta.total.toLocaleString("fa-IR")} کارت
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
