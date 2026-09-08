"use client";

import { useEffect, useState } from "react";
import {
  CircuitBoard,
  Cpu,
  Gamepad2,
  Monitor,
  SlidersHorizontal,
} from "lucide-react";
import { EntitySearch } from "@/components/fps/entity-search";
import { FpsResultPanel } from "@/components/fps/fps-result-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  defaultFpsSelection,
  fetchFpsEstimate,
  mapEstimateToResult,
  presetOptions,
  resolutionOptions,
  type FpsResult,
  type FpsSelection,
  type QualityPreset,
  type ResolutionId,
} from "@/config/fps-calculator";
import { ApiError } from "@/lib/api-client";
import {
  searchCpus,
  searchGames,
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

export function FpsCalculatorPage() {
  const [selection, setSelection] = useState<FpsSelection>({
    game: null,
    gpu: null,
    cpu: null,
    preset: defaultFpsSelection.preset,
    resolution: defaultFpsSelection.resolution,
  });
  const [ready, setReady] = useState(false);
  const [apiPayload, setApiPayload] = useState<Awaited<
    ReturnType<typeof fetchFpsEstimate>
  > | null>(null);
  const [result, setResult] = useState<FpsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrateDefaults() {
      try {
        const [game, gpu, cpu] = await Promise.all([
          resolveDefaultOption(searchGames, defaultFpsSelection.game!.name),
          resolveDefaultOption(searchGpus, defaultFpsSelection.gpu!.name),
          resolveDefaultOption(searchCpus, defaultFpsSelection.cpu!.name),
        ]);
        if (cancelled) return;
        setSelection((prev) => ({ ...prev, game, gpu, cpu }));
      } catch {
        if (!cancelled) {
          setSelection({
            game: defaultFpsSelection.game,
            gpu: defaultFpsSelection.gpu,
            cpu: defaultFpsSelection.cpu,
            preset: defaultFpsSelection.preset,
            resolution: defaultFpsSelection.resolution,
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
    if (!selection.game || !selection.gpu || !selection.cpu) {
      setError("بازی، GPU و CPU را از نتایج جستجو انتخاب کن.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const api = await fetchFpsEstimate(selection);
      setApiPayload(api);
      setResult(mapEstimateToResult(api, selection.resolution));
      setSelection((prev) => ({
        ...prev,
        game: { id: api.game.id, name: api.game.name },
        gpu: { id: api.gpu.id, name: api.gpu.name },
        cpu: { id: api.cpu.id, name: api.cpu.name },
      }));
    } catch (err) {
      setApiPayload(null);
      setResult(null);
      setError(
        err instanceof ApiError
          ? err.message
          : "محاسبه FPS با خطا مواجه شد.",
      );
    } finally {
      setPending(false);
    }
  }

  function handleResolutionChange(resolution: ResolutionId) {
    setSelection((prev) => ({ ...prev, resolution }));
    if (apiPayload) {
      setResult(mapEstimateToResult(apiPayload, resolution));
    }
  }

  function handlePresetChange(preset: QualityPreset) {
    setSelection((prev) => ({ ...prev, preset }));
    // Preset changes the whole curve — previous multi-res payload is stale.
    setApiPayload(null);
    setResult(null);
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-6 lg:py-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <img
          src="/img/fps-calculator.svg"
          alt=""
          className="size-16 shrink-0"
        />
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          محاسبه FPS بازی
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          بازی، سخت‌افزار، کیفیت و رزولوشن را انتخاب کن تا FPS تخمینی را ببینی
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(300px,360px)_1fr] lg:gap-8">
        <Card className="h-fit ring-border/60 shadow-sm">
          <CardContent className="space-y-5 pt-1">
            <FieldGroup>
              <EntitySearch
                id="game"
                label="بازی"
                placeholder="جستجوی بازی..."
                icon={<Gamepad2 className="size-4" />}
                value={selection.game}
                onChange={(game) =>
                  setSelection((prev) => ({ ...prev, game }))
                }
                search={searchGames}
              />

              <div className="flex items-center gap-3 py-1">
                <Separator className="flex-1" />
                <span className="shrink-0 text-sm text-muted-foreground">
                  سخت افزار
                </span>
                <Separator className="flex-1" />
              </div>

              <EntitySearch
                id="gpu"
                label="کارت گرافیک (GPU)"
                placeholder="جستجوی کارت گرافیک..."
                icon={<CircuitBoard className="size-4" />}
                value={selection.gpu}
                onChange={(gpu) => setSelection((prev) => ({ ...prev, gpu }))}
                search={searchGpus}
              />

              <EntitySearch
                id="cpu"
                label="پردازنده (CPU)"
                placeholder="جستجوی پردازنده..."
                icon={<Cpu className="size-4" />}
                value={selection.cpu}
                onChange={(cpu) => setSelection((prev) => ({ ...prev, cpu }))}
                search={searchCpus}
              />

              <div className="flex items-center gap-3 py-1">
                <Separator className="flex-1" />
                <span className="shrink-0 text-sm text-muted-foreground">
                  تنظیمات گرافیک
                </span>
                <Separator className="flex-1" />
              </div>

              <Field>
                <FieldLabel htmlFor="preset">کیفیت</FieldLabel>
                <div className="relative">
                  <SlidersHorizontal className="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Select
                    value={selection.preset}
                    onValueChange={(value) =>
                      value && handlePresetChange(value as QualityPreset)
                    }
                  >
                    <SelectTrigger id="preset" className="h-10 w-full ps-9">
                      <SelectValue placeholder="انتخاب کیفیت..." />
                    </SelectTrigger>
                    <SelectContent>
                      {presetOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="resolution">رزولوشن</FieldLabel>
                <div className="relative">
                  <Monitor className="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Select
                    value={selection.resolution}
                    onValueChange={(value) =>
                      value && handleResolutionChange(value as ResolutionId)
                    }
                  >
                    <SelectTrigger id="resolution" className="h-10 w-full ps-9">
                      <SelectValue placeholder="انتخاب رزولوشن..." />
                    </SelectTrigger>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Field>
            </FieldGroup>

            <Button
              type="button"
              className="h-11 w-full rounded-xl text-base"
              onClick={() => void handleCalculate()}
              disabled={pending || !ready}
            >
              {pending ? "در حال محاسبه..." : "محاسبه FPS"}
            </Button>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="min-h-[420px] ring-border/60 shadow-sm">
          <CardContent className="pt-1">
            {result ? (
              <FpsResultPanel
                result={result}
                activeResolution={selection.resolution}
                onResolutionChange={handleResolutionChange}
              />
            ) : (
              <div className="flex min-h-[380px] items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 text-center text-sm text-muted-foreground">
                بازی، سخت‌افزار، کیفیت و رزولوشن را انتخاب کن و محاسبه کن.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
