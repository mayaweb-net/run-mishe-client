"use client";

import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FpsResult, ResolutionId } from "@/config/fps-calculator";
import { cn } from "@/lib/utils";

type FpsResultPanelProps = {
  result: FpsResult;
  activeResolution: ResolutionId;
  onResolutionChange: (resolution: ResolutionId) => void;
};

const resolutionToneStyles = {
  great: "text-success",
  active: "text-foreground",
  moderate: "text-amber-600",
  low: "text-destructive",
} as const;

export function FpsResultPanel({
  result,
  activeResolution,
  onResolutionChange,
}: FpsResultPanelProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-card p-4">
        <div
          className="size-16 shrink-0 rounded-lg bg-linear-to-br from-red-900 via-red-950 to-stone-900"
          aria-hidden
        />
        <div className="min-w-0 space-y-2">
          <h2 className="text-lg font-bold leading-snug">{result.game}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.hardwareSummary}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{result.resolutionLabel}</Badge>
            <Badge variant="outline">{result.quality}</Badge>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card px-4 py-8 text-center">
        <p className="text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
          {result.estimatedFps}
        </p>
        <p className="mt-2 text-base font-medium">FPS تخمینی</p>
        <p className="mt-1 text-sm text-muted-foreground">
          محدوده: {result.fpsRange.min}-{result.fpsRange.max} FPS
        </p>
        <div className="mx-auto mt-5 w-fit rounded-full border border-success/25 bg-success-bg px-5 py-2 text-sm font-semibold text-success">
          {result.statusLabel}
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <BarChart3 className="size-4" />
          مقایسه رزولوشن
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {result.resolutions.map((item) => {
            const isActive = activeResolution === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onResolutionChange(item.id)}
                className={cn(
                  "rounded-xl border px-3 py-4 text-center transition-colors",
                  isActive
                    ? "border-secondary-6 bg-secondary-1 text-secondary-9"
                    : "border-border/70 bg-background hover:bg-muted/50",
                )}
              >
                <p
                  className={cn(
                    "text-2xl font-bold",
                    isActive
                      ? resolutionToneStyles.active
                      : resolutionToneStyles[item.tone],
                  )}
                >
                  {item.fps}
                </p>
                <p
                  className={cn(
                    "mt-1 text-xs font-medium",
                    isActive ? "text-secondary-9" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
