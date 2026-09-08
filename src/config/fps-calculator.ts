import { apiPost } from "@/lib/api-client";
import type { SearchOption } from "@/lib/catalog-search";

export type QualityPreset = "LOW" | "MEDIUM" | "HIGH" | "ULTRA";
export type ResolutionId = "720p" | "1080p" | "1440p" | "4k";

export type FpsSelection = {
  game: SearchOption | null;
  gpu: SearchOption | null;
  cpu: SearchOption | null;
  preset: QualityPreset;
  resolution: ResolutionId;
};

export const defaultFpsSelection: FpsSelection = {
  game: {
    id: "",
    name: "Red Dead Redemption 2",
  },
  gpu: {
    id: "",
    name: "NVIDIA GeForce RTX 4060",
  },
  cpu: {
    id: "",
    name: "AMD Ryzen 5 3600",
  },
  preset: "HIGH",
  resolution: "1080p",
};

/** Hidden default for API — RAM is not exposed in the FPS form yet. */
export const DEFAULT_RAM_GB = 16;

export const presetOptions: Array<{ value: QualityPreset; label: string }> = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "ULTRA", label: "Ultra" },
];

export const resolutionOptions: Array<{ value: ResolutionId; label: string }> =
  [
    { value: "720p", label: "720p" },
    { value: "1080p", label: "1080p" },
    { value: "1440p", label: "1440p" },
    { value: "4k", label: "4K" },
  ];

export type ResolutionFps = {
  id: ResolutionId;
  label: string;
  fps: number;
  onePercentLow: number;
  limitedBy: "CPU" | "GPU";
  bottleneckLabel: string;
  tone: "great" | "active" | "moderate" | "low";
};

export type FpsResult = {
  game: string;
  hardwareSummary: string;
  quality: string;
  resolutionLabel: string;
  estimatedFps: number;
  onePercentLow: number;
  fpsRange: { min: number; max: number };
  statusLabel: string;
  confidenceLabel: string;
  limitedBy: "CPU" | "GPU";
  bottleneckLabel: string;
  warnings: string[];
  resolutions: ResolutionFps[];
};

type ApiResolution =
  | "R720P"
  | "R1080P"
  | "R1440P"
  | "R2160P"
  | "UW1440P"
  | "UW2160P";

type FpsEstimateApiResponse = {
  confidenceLabel: string;
  preset: QualityPreset;
  warnings: string[];
  game: { id: string; name: string; coverUrl: string | null };
  cpu: { id: string; name: string; gamingIndex: number };
  gpu: { id: string; name: string; gamingIndex: number; vramGb: number | null };
  ramGb: number;
  results: Array<{
    resolution: ApiResolution;
    fps: number;
    onePercentLow: number;
    limitedBy: "CPU" | "GPU";
    bottleneckLabel: string;
  }>;
};

const resolutionMap: Record<
  ResolutionId,
  { api: ApiResolution; label: string }
> = {
  "720p": { api: "R720P", label: "720p" },
  "1080p": { api: "R1080P", label: "1080p" },
  "1440p": { api: "R1440P", label: "1440p" },
  "4k": { api: "R2160P", label: "4K" },
};

export function resolutionApiValue(id: ResolutionId): ApiResolution {
  return resolutionMap[id].api;
}

export function presetLabel(preset: QualityPreset): string {
  return presetOptions.find((item) => item.value === preset)?.label ?? preset;
}

function toneForFps(fps: number): ResolutionFps["tone"] {
  if (fps >= 100) return "great";
  if (fps >= 60) return "active";
  if (fps >= 40) return "moderate";
  return "low";
}

function statusForFps(fps: number): string {
  if (fps >= 100) return "عالی — خیلی روان";
  if (fps >= 60) return "خوب — روان";
  if (fps >= 40) return "متوسط — قابل قبول";
  return "ضعیف — سنگین";
}

function toUiResolutions(
  results: FpsEstimateApiResponse["results"],
  active: ResolutionId,
): ResolutionFps[] {
  return (Object.keys(resolutionMap) as ResolutionId[]).map((id) => {
    const meta = resolutionMap[id];
    const row = results.find((item) => item.resolution === meta.api);
    const fps = row ? Math.round(row.fps) : 0;
    return {
      id,
      label: meta.label,
      fps,
      onePercentLow: row ? Math.round(row.onePercentLow) : 0,
      limitedBy: row?.limitedBy ?? "GPU",
      bottleneckLabel: row?.bottleneckLabel ?? "—",
      tone: id === active ? "active" : toneForFps(fps),
    };
  });
}

export function mapEstimateToResult(
  api: FpsEstimateApiResponse,
  activeResolution: ResolutionId,
): FpsResult {
  const resolutions = toUiResolutions(api.results, activeResolution);
  const active =
    resolutions.find((item) => item.id === activeResolution) ?? resolutions[1];
  const variance = Math.max(3, Math.round(active.fps * 0.08));

  return {
    game: api.game.name,
    hardwareSummary: `${api.gpu.name} + ${api.cpu.name}`,
    quality: presetLabel(api.preset),
    resolutionLabel: active.label,
    estimatedFps: active.fps,
    onePercentLow: active.onePercentLow,
    fpsRange: {
      min: Math.max(1, active.fps - variance),
      max: active.fps + variance,
    },
    statusLabel: statusForFps(active.fps),
    confidenceLabel: api.confidenceLabel,
    limitedBy: active.limitedBy,
    bottleneckLabel: active.bottleneckLabel,
    warnings: api.warnings,
    resolutions,
  };
}

export async function fetchFpsEstimate(
  selection: FpsSelection,
): Promise<FpsEstimateApiResponse> {
  const body: Record<string, unknown> = {
    ramGb: DEFAULT_RAM_GB,
    preset: selection.preset,
    upscaler: "NONE",
    rayTracing: false,
    resolutions: ["R720P", "R1080P", "R1440P", "R2160P"],
  };

  if (selection.game?.id) body.gameId = selection.game.id;
  else if (selection.game?.name) body.gameQuery = selection.game.name;

  if (selection.gpu?.id) body.gpuId = selection.gpu.id;
  else if (selection.gpu?.name) body.gpuQuery = selection.gpu.name;

  if (selection.cpu?.id) body.cpuId = selection.cpu.id;
  else if (selection.cpu?.name) body.cpuQuery = selection.cpu.name;

  return apiPost<FpsEstimateApiResponse>("/fps-estimate", body);
}
