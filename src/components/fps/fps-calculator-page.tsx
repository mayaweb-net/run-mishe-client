"use client";

import { useMemo, useState } from "react";
import {
  CircuitBoard,
  Cpu,
  Gamepad2,
  MemoryStick,
} from "lucide-react";
import { FpsResultPanel } from "@/components/fps/fps-result-panel";
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
  defaultFpsInput,
  getFpsResult,
  ramOptions,
  type FpsInput,
  type ResolutionId,
} from "@/config/fps-calculator";

export function FpsCalculatorPage() {
  const [input, setInput] = useState<FpsInput>(defaultFpsInput);
  const [gameQuery, setGameQuery] = useState(defaultFpsInput.game);
  const [gpuQuery, setGpuQuery] = useState(defaultFpsInput.gpu);
  const [cpuQuery, setCpuQuery] = useState(defaultFpsInput.cpu);
  const [ram, setRam] = useState(defaultFpsInput.ram);
  const [activeResolution, setActiveResolution] = useState<ResolutionId>("1080p");
  const [showResults, setShowResults] = useState(true);

  const result = useMemo(
    () => getFpsResult(input, activeResolution),
    [input, activeResolution],
  );

  function handleCalculate() {
    setInput({
      game: gameQuery.trim() || defaultFpsInput.game,
      gpu: gpuQuery.trim() || defaultFpsInput.gpu,
      cpu: cpuQuery.trim() || defaultFpsInput.cpu,
      ram: ram || defaultFpsInput.ram,
    });
    setShowResults(true);
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
          می‌تونی بازی و سخت‌افزارتو انتخاب کنی تا بهت بگم خروجی چند FPS می‌ده
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
              onClick={handleCalculate}
            >
              ران میشه؟
            </Button>
          </CardContent>
        </Card>

        <Card className="min-h-[420px] ring-border/60 shadow-sm">
          <CardContent className="pt-1">
            {showResults ? (
              <FpsResultPanel
                result={result}
                activeResolution={activeResolution}
                onResolutionChange={setActiveResolution}
              />
            ) : (
              <div className="flex min-h-[380px] items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 text-center text-sm text-muted-foreground">
                بازی و مشخصات سخت‌افزار رو وارد کن و روی «ران میشه؟» بزن.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
