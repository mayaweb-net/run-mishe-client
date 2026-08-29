"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  CircuitBoard,
  Cpu,
  MemoryStick,
  Search,
} from "lucide-react";
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
import {
  categorySummaries,
  defaultHardware,
  gamingExamples,
  gamingLimitations,
  getComponentStatuses,
  ramOptions,
  systemCategories,
  type HardwareSpec,
} from "@/config/system-check";
import { cn } from "@/lib/utils";

const ratingStyles = {
  good: "border-success/35 bg-success-bg text-success",
  "very-good": "border-success/35 bg-success-bg text-success",
  average: "border-warning/35 bg-warning-bg text-warning",
} as const;

export function SystemCheckPage() {
  const [activeCategory, setActiveCategory] = useState("gaming");
  const [spec, setSpec] = useState<HardwareSpec>(defaultHardware);
  const [gpuQuery, setGpuQuery] = useState(defaultHardware.gpu);
  const [cpuQuery, setCpuQuery] = useState(defaultHardware.cpu);
  const [ram, setRam] = useState("32");
  const [showResults, setShowResults] = useState(true);

  const activeMeta = systemCategories.find((item) => item.id === activeCategory);
  const statuses = getComponentStatuses(spec);

  function handleCheck() {
    setSpec({
      gpu: gpuQuery.trim() || defaultHardware.gpu,
      cpu: cpuQuery.trim() || defaultHardware.cpu,
      ram: `${ram} GB`,
    });
    setShowResults(true);
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-6 lg:py-10">
      <h1 className="mx-auto max-w-3xl text-center text-2xl font-bold leading-relaxed tracking-tight sm:text-3xl">
        مشخصات سیستمی رو که می‌خوای وارد کن ببین ران می‌شه؟
      </h1>

      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(280px,320px)_1fr] lg:gap-8">
        <Card className="h-fit ring-border/60 shadow-sm">
          <CardContent className="space-y-5 pt-1">
            <FieldGroup>
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
                            {option} GB
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
              <Search />
              این سیستم چطوره؟
            </Button>
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap gap-2">
            {systemCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-secondary-6 bg-secondary-1 text-secondary-9"
                      : "border-border bg-card text-foreground/80 hover:bg-muted/50",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {category.label}
                </button>
              );
            })}
          </div>

          {showResults ? (
            <Card className="ring-border/60 shadow-sm">
              <CardContent className="space-y-5 pt-1">
                <h2 className="text-lg font-bold">
                  {activeMeta?.resultTitle ?? "نتیجه بررسی"}
                </h2>

                <div className="grid gap-3 sm:grid-cols-3">
                  {statuses.map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        "rounded-xl border-2 px-4 py-3",
                        ratingStyles[item.rating],
                      )}
                    >
                      <p className="text-xs font-medium opacity-80">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-bold">{item.value}</p>
                      <p className="mt-2 text-sm font-semibold">
                        {item.ratingLabel}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-success/25 bg-success-bg px-4 py-3 text-sm leading-relaxed text-success">
                  {categorySummaries[activeCategory]}
                </div>

                {activeCategory === "gaming" ? (
                  <>
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-muted-foreground">
                        مثلاً:
                      </p>
                      {gamingExamples.map((game) => (
                        <div
                          key={game.name}
                          className="flex items-start gap-3 rounded-xl border border-border/70 bg-card p-3"
                        >
                          <div
                            className={cn(
                              "size-12 shrink-0 rounded-lg",
                              game.color,
                            )}
                            aria-hidden
                          />
                          <p className="text-sm leading-relaxed text-foreground/90">
                            {game.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-muted-foreground">
                        کجا کم میاره؟
                      </p>
                      {gamingLimitations.map((note) => (
                        <div
                          key={note}
                          className="rounded-xl border border-warning/20 bg-warning-bg px-4 py-3 text-sm leading-relaxed text-foreground/85"
                        >
                          {note}
                        </div>
                      ))}
                    </div>

                    <Button
                      render={<Link href="/fps" />}
                      nativeButton={false}
                      variant="outline"
                      className="h-11 w-full rounded-xl border-border/80 text-sm font-medium"
                    >
                      برای بررسی دقیق‌تر این سیستم تو بازی کلیک کن
                      <ChevronLeft />
                    </Button>
                  </>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <Card className="ring-border/60 shadow-sm">
              <CardContent className="py-10 text-center text-muted-foreground">
                مشخصات سیستم رو وارد کن و روی «این سیستم چطوره؟» بزن.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
