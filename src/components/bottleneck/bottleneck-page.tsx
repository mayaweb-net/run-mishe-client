"use client";

import { useEffect, useState } from "react";
import { CircuitBoard, Cpu, MemoryStick } from "lucide-react";
import {
  BottleneckEmptyState,
  BottleneckResultPanel,
} from "@/components/bottleneck/bottleneck-result-panel";
import { EntitySearch } from "@/components/fps/entity-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  defaultBottleneckSelection,
  fetchBottleneck,
  mapBottleneckToResult,
  ramOptions,
  type BottleneckResult,
  type BottleneckSelection,
} from "@/config/bottleneck";
import { ApiError } from "@/lib/api-client";
import {
  searchCpus,
  searchGpus,
  type SearchOption,
} from "@/lib/catalog-search";

async function resolveDefaultOption(
  search: (query: string) => Promise<SearchOption[]>,
  name: string,
): Promise<SearchOption | null> {
  const options = await search(name);
  const exact = options.find(
    (item) => item.name.toLowerCase() === name.toLowerCase(),
  );
  return exact ?? options[0] ?? { id: "", name };
}

export function BottleneckPage() {
  const [selection, setSelection] = useState<BottleneckSelection>({
    gpu: null,
    cpu: null,
    ram: defaultBottleneckSelection.ram,
  });
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState<BottleneckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrateDefaults() {
      try {
        const [gpu, cpu] = await Promise.all([
          resolveDefaultOption(
            searchGpus,
            defaultBottleneckSelection.gpu!.name,
          ),
          resolveDefaultOption(
            searchCpus,
            defaultBottleneckSelection.cpu!.name,
          ),
        ]);
        if (cancelled) return;
        setSelection((prev) => ({ ...prev, gpu, cpu }));
      } catch {
        if (!cancelled) {
          setSelection({
            gpu: defaultBottleneckSelection.gpu,
            cpu: defaultBottleneckSelection.cpu,
            ram: defaultBottleneckSelection.ram,
          });
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void hydrateDefaults();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCalculate() {
    if (!selection.gpu || !selection.cpu) {
      setError("GPU و CPU را از نتایج جستجو انتخاب کن.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const api = await fetchBottleneck(selection);
      setResult(mapBottleneckToResult(api));
    } catch (err) {
      setResult(null);
      setError(
        err instanceof ApiError
          ? err.message
          : "خطا در محاسبه گلوگاه. دوباره تلاش کن.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <Card className="h-fit border-border/70 shadow-none">
        <CardContent className="space-y-5 pt-6">
          <div>
            <h1 className="text-xl font-bold">گلوگاه قطعات</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              فقط تعادل CPU و GPU — بدون وابستگی به بازی.
            </p>
          </div>

          <Separator />

          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>پردازنده</FieldLabel>
              <EntitySearch
                label="CPU"
                placeholder="جستجوی CPU…"
                icon={<Cpu className="size-4" />}
                value={selection.cpu}
                onChange={(cpu) => setSelection((prev) => ({ ...prev, cpu }))}
                search={searchCpus}
              />
            </Field>

            <Field>
              <FieldLabel>کارت گرافیک</FieldLabel>
              <EntitySearch
                label="GPU"
                placeholder="جستجوی GPU…"
                icon={<CircuitBoard className="size-4" />}
                value={selection.gpu}
                onChange={(gpu) => setSelection((prev) => ({ ...prev, gpu }))}
                search={searchGpus}
              />
            </Field>

            <Field>
              <FieldLabel>رم</FieldLabel>
              <Select
                value={String(selection.ram)}
                onValueChange={(value) =>
                  setSelection((prev) => ({
                    ...prev,
                    ram: Number(value),
                  }))
                }
              >
                <SelectTrigger>
                  <MemoryStick className="size-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ramOptions.map((ram) => (
                    <SelectItem key={ram} value={String(ram)}>
                      {ram} GB
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <Button
            className="w-full"
            disabled={!ready || pending}
            onClick={() => void handleCalculate()}
          >
            {pending ? "در حال محاسبه…" : "محاسبه گلوگاه"}
          </Button>
        </CardContent>
      </Card>

      <div className="min-h-64">
        {result ? (
          <BottleneckResultPanel result={result} />
        ) : (
          <BottleneckEmptyState />
        )}
      </div>
    </div>
  );
}
