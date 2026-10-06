"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BottleneckResultPanel } from "@/components/bottleneck/bottleneck-result-panel";
import { Logo } from "@/components/main/logo";
import {
  RunCheckEmptyState,
  RunCheckResultPanel,
} from "@/components/review/run-check-result-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  mapBottleneckToResult,
  type BottleneckResult,
} from "@/config/bottleneck";
import {
  mapRunCheckToResult,
  type RunCheckResult,
} from "@/config/run-check";
import { apiGet } from "@/lib/api-client";

type SnapshotState =
  | { kind: "RUN_CHECK"; result: RunCheckResult }
  | { kind: "BOTTLENECK"; result: BottleneckResult };

export function CheckSnapshotPage({ code }: { code: string }) {
  const [state, setState] = useState<SnapshotState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const snap = await apiGet<{
          kind: string;
          result: Record<string, unknown>;
          sharePath: string;
          publicCode: string;
        }>(`/checks/${encodeURIComponent(code)}`);

        if (cancelled) return;

        if (snap.kind === "BOTTLENECK") {
          setState({
            kind: "BOTTLENECK",
            result: mapBottleneckToResult({
              ...(snap.result as Parameters<typeof mapBottleneckToResult>[0]),
              shareCode: snap.publicCode,
              sharePath: snap.sharePath,
            }),
          });
        } else {
          setState({
            kind: "RUN_CHECK",
            result: mapRunCheckToResult({
              ...(snap.result as Parameters<typeof mapRunCheckToResult>[0]),
              shareCode: snap.publicCode,
              sharePath: snap.sharePath,
            }),
          });
        }
      } catch {
        if (!cancelled) {
          setState(null);
          setError("این لینک پیدا نشد یا منقضی شده است.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [code]);

  const backHref = state?.kind === "BOTTLENECK" ? "/bottleneck" : "/review";

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 lg:px-6 lg:py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <Logo href="/" size="md" />
        <h1 className="mt-3 text-xl font-bold">نتیجهٔ به‌اشتراک‌گذاشته</h1>
      </div>

      <Card className="ring-border/60 shadow-sm">
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center gap-2 text-muted-foreground">
              <Spinner />
              در حال بارگذاری...
            </div>
          ) : error ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button render={<Link href={backHref} />} nativeButton={false}>
                بررسی جدید
              </Button>
            </div>
          ) : state?.kind === "BOTTLENECK" ? (
            <BottleneckResultPanel result={state.result} />
          ) : state?.kind === "RUN_CHECK" ? (
            <RunCheckResultPanel result={state.result} />
          ) : (
            <RunCheckEmptyState />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
