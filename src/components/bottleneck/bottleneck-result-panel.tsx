"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BottleneckResult } from "@/config/bottleneck";
import { cn } from "@/lib/utils";

type BottleneckResultPanelProps = {
  result: BottleneckResult;
};

function severityTone(percent: number) {
  if (percent < 10) return "text-success";
  if (percent < 25) return "text-foreground";
  if (percent < 45) return "text-amber-600";
  return "text-destructive";
}

export function BottleneckResultPanel({ result }: BottleneckResultPanelProps) {
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${result.sharePath}`
      : result.sharePath;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border/70 bg-card p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-bold leading-snug">تعادل قطعات</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.hardwareSummary}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              CPU index {result.cpuIndex.toFixed(1)}
            </Badge>
            <Badge variant="outline">
              GPU index {result.gpuIndex.toFixed(1)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card px-4 py-8 text-center">
        <p
          className={cn(
            "text-5xl font-bold tracking-tight sm:text-6xl",
            severityTone(result.percent),
          )}
        >
          {Math.round(result.percent)}%
        </p>
        <p className="mt-2 text-base font-medium">{result.label}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          محدودکننده: {result.limitedBy}
        </p>
        {result.warnings.length > 0 ? (
          <ul className="mx-auto mt-4 max-w-md space-y-1 text-start text-xs text-amber-700">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-card p-4">
        <p className="grow text-sm text-muted-foreground">
          لینک اشتراک:{" "}
          <span className="font-mono text-foreground">{result.shareCode}</span>
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            void navigator.clipboard.writeText(shareUrl);
          }}
        >
          کپی لینک
        </Button>
      </div>
    </div>
  );
}

export function BottleneckEmptyState() {
  return (
    <div className="flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
        CPU و GPU را انتخاب کن تا درصد گلوگاه بین همین دو قطعه دیده شود.
      </p>
    </div>
  );
}
