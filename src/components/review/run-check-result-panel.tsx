"use client";

import {
  BarChart3,
  Check,
  Copy,
  Gauge,
  Share2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RequirementTier, RunCheckResult } from "@/config/run-check";

type RunCheckResultPanelProps = {
  result: RunCheckResult;
};

function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <Check className="mt-0.5 size-4 shrink-0 text-success" />
  ) : (
    <X className="mt-0.5 size-4 shrink-0 text-destructive" />
  );
}

function RequirementColumn({
  tier,
  userSpec,
}: {
  tier: RequirementTier;
  userSpec: RunCheckResult["userSpec"];
}) {
  const items = [
    {
      label: "GPU",
      value: userSpec.gpu,
      ok: tier.gpuStatus !== "fail",
      need: tier.gpu,
    },
    {
      label: "CPU",
      value: userSpec.cpu,
      ok: tier.cpuStatus !== "fail",
      need: tier.cpu,
    },
    {
      label: "RAM",
      value: `${userSpec.ram} GB`,
      ok: tier.ramStatus !== "fail",
      need: tier.ram,
    },
  ];

  return (
    <div className="relative rounded-xl border border-border/70 bg-background p-4 pt-5">
      {tier.passed ? (
        <Badge className="absolute -top-2.5 start-3 border-success/25 bg-success-bg text-success hover:bg-success-bg">
          حله
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="absolute -top-2.5 start-3 border-destructive/30 text-destructive"
        >
          ناکافی
        </Badge>
      )}
      <p className="text-sm font-semibold">{tier.title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-2 text-sm">
            <StatusIcon ok={item.ok} />
            <div className="min-w-0">
              <div>
                <span className="font-medium text-muted-foreground">
                  {item.label}:
                </span>{" "}
                <span className="font-semibold">{item.value}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                نیاز: {item.need}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RunCheckResultPanel({ result }: RunCheckResultPanelProps) {
  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(result.shareUrl);
    } catch {
      // clipboard unavailable
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: result.game,
          url: result.shareUrl,
        });
      } catch {
        // user cancelled or share failed
      }
      return;
    }

    await handleCopyLink();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-card p-4">
        {result.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.coverUrl}
            alt=""
            className="size-16 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div
            className="size-16 shrink-0 rounded-lg bg-linear-to-br from-red-900 via-red-950 to-stone-900"
            aria-hidden
          />
        )}
        <div className="min-w-0 space-y-2">
          <h2 className="text-lg font-bold leading-snug">{result.game}</h2>
          <Badge
            className={
              result.runs
                ? "gap-1 border-success/25 bg-success-bg text-success hover:bg-success-bg"
                : "gap-1 border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10"
            }
          >
            {result.runs ? <Check className="size-3" /> : <X className="size-3" />}
            {result.statusLabel}
          </Badge>
        </div>
      </div>

      {result.warnings.length > 0 ? (
        <ul className="space-y-1 rounded-xl border border-border/70 bg-muted/20 p-3 text-xs text-muted-foreground">
          {result.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}

      <div className="rounded-xl border border-border/70 bg-card p-4">
        <h3 className="text-sm font-bold">بررسی قطعات</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <RequirementColumn tier={result.minimum} userSpec={result.userSpec} />
          <RequirementColumn
            tier={result.recommended}
            userSpec={result.userSpec}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card p-4">
        <h3 className="text-sm font-bold">خروجی بازی</h3>
        <p
          className={`mt-3 text-base font-semibold ${result.runs ? "text-success" : "text-destructive"}`}
        >
          {result.performanceSummary}
        </p>
        <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
          <Gauge className="mt-0.5 size-4 shrink-0 text-secondary-7" />
          {result.performanceDetail}
        </p>
      </div>

      <div className="rounded-xl border border-border/70 bg-card p-4">
        <h3 className="text-sm font-bold">اشتراک گذاشتن نتیجه</h3>
        <Input
          readOnly
          value={result.shareUrl}
          className="mt-3 bg-muted/30"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={handleCopyLink}
          >
            <Copy />
            کپی کردن لینک
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={handleShare}
          >
            <Share2 />
            اشتراک گذاری
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RunCheckEmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground/50">
        <BarChart3 className="size-10 stroke-[1.25]" />
      </div>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        بازی و سخت‌افزارتو انتخاب کن تا بهت بگم ران میشه یا نه
      </p>
    </div>
  );
}
