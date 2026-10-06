"use client";

import { useEffect, useState } from "react";
import {
  CircuitBoard,
  Cpu,
  Gamepad2,
  MemoryStick,
} from "lucide-react";
import { Logo } from "@/components/main/logo";
import { EntitySearch } from "@/components/fps/entity-search";
import {
  RunCheckEmptyState,
  RunCheckResultPanel,
} from "@/components/review/run-check-result-panel";
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
  defaultRunCheckSelection,
  fetchRunCheck,
  howItWorksParagraphs,
  ramOptions,
  type RunCheckResult,
  type RunCheckSelection,
} from "@/config/run-check";
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

export function RunCheckPage() {
  const [selection, setSelection] = useState<RunCheckSelection>({
    game: null,
    gpu: null,
    cpu: null,
    ram: defaultRunCheckSelection.ram,
  });
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState<RunCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrateDefaults() {
      try {
        const [game, gpu, cpu] = await Promise.all([
          resolveDefaultOption(searchGames, defaultRunCheckSelection.game!.name),
          resolveDefaultOption(searchGpus, defaultRunCheckSelection.gpu!.name),
          resolveDefaultOption(searchCpus, defaultRunCheckSelection.cpu!.name),
        ]);
        if (cancelled) return;
        setSelection((prev) => ({ ...prev, game, gpu, cpu }));
      } catch {
        if (!cancelled) {
          setSelection({
            game: defaultRunCheckSelection.game,
            gpu: defaultRunCheckSelection.gpu,
            cpu: defaultRunCheckSelection.cpu,
            ram: defaultRunCheckSelection.ram,
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

  async function handleCheck() {
    if (!selection.game?.id || !selection.gpu?.id || !selection.cpu?.id) {
      setError("بازی، GPU و CPU را از نتایج جستجو انتخاب کن.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const next = await fetchRunCheck(selection);
      setResult(next);
    } catch (err) {
      setResult(null);
      setError(
        err instanceof ApiError
          ? err.message
          : "بررسی با خطا مواجه شد. اتصال سرور را چک کن.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-6 lg:py-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Logo href="" size="lg" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          ران میشه؟
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          می‌تونی بازی و سخت‌افزارتو انتخاب کنی تا بهت بگم بازی ران میشه یا نه
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

              <Field>
                <FieldLabel htmlFor="ram">رم (RAM)</FieldLabel>
                <div className="flex items-center gap-2">
                  <div className="relative min-w-0 flex-1">
                    <MemoryStick className="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Select
                      value={selection.ram}
                      onValueChange={(value) =>
                        value &&
                        setSelection((prev) => ({ ...prev, ram: value }))
                      }
                    >
                      <SelectTrigger id="ram" className="w-full ps-9">
                        <SelectValue placeholder="انتخاب رم..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ramOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    GB
                  </span>
                </div>
              </Field>
            </FieldGroup>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <Button
              type="button"
              className="h-11 w-full rounded-xl text-base"
              disabled={!ready || pending}
              onClick={() => void handleCheck()}
            >
              {pending ? "در حال بررسی..." : "ران میشه؟"}
            </Button>
          </CardContent>
        </Card>

        <Card className="min-h-[420px] ring-border/60 shadow-sm">
          <CardContent className="pt-1">
            {result ? (
              <RunCheckResultPanel result={result} />
            ) : (
              <RunCheckEmptyState />
            )}
          </CardContent>
        </Card>
      </div>

      <section className="mt-12 border-t border-border/60 pt-10 lg:mt-16">
        <h2 className="text-lg font-bold">ران میشه چطور کار میکنه؟</h2>
        <div className="mt-5 space-y-4 text-sm leading-8 text-muted-foreground">
          {howItWorksParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
