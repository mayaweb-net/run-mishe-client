import { apiGet, apiPost } from "@/lib/api-client";
import type { SearchOption } from "@/lib/catalog-search";

export type ComponentStatus = "pass" | "fail" | "warn" | "unknown";

export type RunCheckVerdict =
  | "BELOW_MINIMUM"
  | "MEETS_MINIMUM"
  | "ABOVE_RECOMMENDED";

export type RequirementTier = {
  title: string;
  gpu: string;
  cpu: string;
  ram: string;
  passed: boolean;
  cpuStatus?: ComponentStatus;
  gpuStatus?: ComponentStatus;
  ramStatus?: ComponentStatus;
  vramStatus?: ComponentStatus;
};

export type RunCheckResult = {
  game: string;
  coverUrl: string | null;
  runs: boolean;
  statusLabel: string;
  verdict: RunCheckVerdict;
  userSpec: {
    gpu: string;
    cpu: string;
    ram: string;
  };
  minimum: RequirementTier;
  recommended: RequirementTier;
  performanceSummary: string;
  performanceDetail: string;
  shareUrl: string;
  shareCode: string;
  warnings: string[];
  expectedPerformance: {
    resolution: string;
    preset: string;
    fps: number;
  } | null;
};

export type RunCheckSelection = {
  game: SearchOption | null;
  gpu: SearchOption | null;
  cpu: SearchOption | null;
  ram: string;
};

export const defaultRunCheckSelection: RunCheckSelection = {
  game: { id: "", name: "Red Dead Redemption 2" },
  gpu: { id: "", name: "NVIDIA GeForce RTX 4060" },
  cpu: { id: "", name: "AMD Ryzen 5 3600" },
  ram: "16",
};

export const ramOptions = ["8", "16", "32", "64", "128"] as const;

type RunCheckApiResponse = {
  verdict: RunCheckVerdict;
  runs: boolean;
  statusLabel: string;
  warnings: string[];
  game: { id: string; name: string; coverUrl: string | null };
  userSpec: {
    cpu: string;
    gpu: string;
    ram: string;
  };
  minimum: RequirementTier;
  recommended: RequirementTier;
  performanceSummary: string;
  performanceDetail: string;
  expectedPerformance: RunCheckResult["expectedPerformance"];
  shareCode: string;
  sharePath: string;
};

export function mapRunCheckToResult(
  api: RunCheckApiResponse,
  origin?: string,
): RunCheckResult {
  const base =
    origin ??
    (typeof window !== "undefined" ? window.location.origin : "https://runmishe.com");
  return {
    game: api.game.name,
    coverUrl: api.game.coverUrl,
    runs: api.runs,
    statusLabel: api.statusLabel,
    verdict: api.verdict,
    userSpec: {
      gpu: api.userSpec.gpu,
      cpu: api.userSpec.cpu,
      ram: api.userSpec.ram,
    },
    minimum: api.minimum,
    recommended: api.recommended,
    performanceSummary: api.performanceSummary,
    performanceDetail: api.performanceDetail,
    expectedPerformance: api.expectedPerformance,
    shareCode: api.shareCode,
    shareUrl: `${base}${api.sharePath}`,
    warnings: api.warnings ?? [],
  };
}

export async function fetchRunCheck(
  selection: RunCheckSelection,
): Promise<RunCheckResult> {
  if (!selection.game?.id || !selection.cpu?.id || !selection.gpu?.id) {
    throw new Error("incomplete selection");
  }
  const api = await apiPost<RunCheckApiResponse>("/run-check", {
    gameId: selection.game.id,
    cpuId: selection.cpu.id,
    gpuId: selection.gpu.id,
    ramGb: Number(selection.ram) || 16,
  });
  return mapRunCheckToResult(api);
}

export async function fetchCheckSnapshot(
  code: string,
): Promise<RunCheckResult> {
  const snap = await apiGet<{
    result: RunCheckApiResponse;
    sharePath: string;
    publicCode: string;
  }>(`/checks/${encodeURIComponent(code)}`);

  const result = snap.result;
  return mapRunCheckToResult({
    ...result,
    shareCode: snap.publicCode,
    sharePath: snap.sharePath,
  });
}

export const howItWorksParagraphs = [
  "سیستمت را با حداقل و پیشنهادی بازی مقایسه می‌کنیم: شاخص عملکرد CPU و GPU به‌همراه مقدار RAM.",
  "اگر از حداقل رد شوی، نتیجه «ران نمیشه» است. اگر فقط حداقل را پوشش دهی، اجرا می‌شود ولی تجربه محدود است.",
  "وقتی از پیشنهادی هم بالاتر باشی، برای کیفیت‌های بالا آماده‌ای؛ برای عدد دقیق‌تر فریم از صفحهٔ محاسبه‌گر FPS استفاده کن.",
  "نتیجه را می‌توانی با لینک کوتاه به‌اشتراک بگذاری؛ همان عددی که دیدی ذخیره می‌شود.",
] as const;
