"use client";

import { useMemo, useState } from "react";
import {
  CircuitBoard,
  Cpu,
  Gamepad2,
  MemoryStick,
} from "lucide-react";
import { Logo } from "@/components/main/logo";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  defaultRunCheckInput,
  getRunCheckResult,
  howItWorksParagraphs,
  ramOptions,
  type RunCheckInput,
} from "@/config/run-check";

export function RunCheckPage() {
  const [input, setInput] = useState<RunCheckInput>(defaultRunCheckInput);
  const [gameQuery, setGameQuery] = useState(defaultRunCheckInput.game);
  const [gpuQuery, setGpuQuery] = useState(defaultRunCheckInput.gpu);
  const [cpuQuery, setCpuQuery] = useState(defaultRunCheckInput.cpu);
  const [ram, setRam] = useState(defaultRunCheckInput.ram);
  const [showResults, setShowResults] = useState(false);

  const result = useMemo(() => getRunCheckResult(input), [input]);

  function handleCheck() {
    setInput({
      game: gameQuery.trim() || defaultRunCheckInput.game,
      gpu: gpuQuery.trim() || defaultRunCheckInput.gpu,
      cpu: cpuQuery.trim() || defaultRunCheckInput.cpu,
      ram: ram || defaultRunCheckInput.ram,
    });
    setShowResults(true);
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
              <Field>
                <FieldLabel htmlFor="game">بازی</FieldLabel>
                <div className="relative">
                  <Gamepad2 className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="game"
                    value={gameQuery}
                    onChange={(event) => setGameQuery(event.target.value)}
                    placeholder="جستجوی بازی..."
                    className="ps-9"
                  />
                </div>
              </Field>

              <div className="flex items-center gap-3 py-1">
                <Separator className="flex-1" />
                <span className="shrink-0 text-sm text-muted-foreground">
                  سخت افزار
                </span>
                <Separator className="flex-1" />
              </div>

              <Field>
                <FieldLabel htmlFor="gpu">کارت گرافیک (GPU)</FieldLabel>
                <div className="relative">
                  <CircuitBoard className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="gpu"
                    value={gpuQuery}
                    onChange={(event) => setGpuQuery(event.target.value)}
                    placeholder="جستجوی کارت گرافیک..."
                    className="ps-9"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="cpu">پردازنده (CPU)</FieldLabel>
                <div className="relative">
                  <Cpu className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="cpu"
                    value={cpuQuery}
                    onChange={(event) => setCpuQuery(event.target.value)}
                    placeholder="جستجوی پردازنده..."
                    className="ps-9"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="ram">رم (RAM)</FieldLabel>
                <div className="flex items-center gap-2">
                  <div className="relative min-w-0 flex-1">
                    <MemoryStick className="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Select
                      value={ram}
                      onValueChange={(value) => value && setRam(value)}
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

            <Button
              type="button"
              className="h-11 w-full rounded-xl text-base"
              onClick={handleCheck}
            >
              ران میشه؟
            </Button>
          </CardContent>
        </Card>

        <Card className="min-h-[420px] ring-border/60 shadow-sm">
          <CardContent className="pt-1">
            {showResults ? (
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
