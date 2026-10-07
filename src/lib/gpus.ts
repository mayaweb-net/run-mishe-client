import { buildApiUrl } from "@/lib/api-client";
import { encodePathSegment } from "@/lib/site";

export type PublicGpuBenchmarkScore = {
  id: string;
  score: number;
  minScore: number | null;
  maxScore: number | null;
  sampleCount: number | null;
  source: string;
  sourceUrl: string | null;
  capturedAt: string;
  benchmark: {
    id: string;
    slug: string;
    name: string;
    vendor: string;
    category: string | null;
    unit: string;
    higherIsBetter: boolean;
  };
};

export type QualityPreset = "LOW" | "MEDIUM" | "HIGH" | "ULTRA";

export type GpuGamePerformance = {
  game: {
    id: string;
    slug: string;
    name: string;
    nameFa: string | null;
    coverUrl: string | null;
  };
  resolution: string | null;
  presets: Record<QualityPreset, number | null>;
};

export type PublicGpuDetail = {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  family: string | null;
  series: string | null;
  generation: number | null;
  architecture: string | null;
  codename: string | null;
  chip: string | null;
  releaseDate: string | null;
  shadingUnits: number | null;
  tmus: number | null;
  rops: number | null;
  tensorCores: number | null;
  rayTracingCores: number | null;
  baseClockMhz: number | null;
  boostClockMhz: number | null;
  gameClockMhz: number | null;
  memoryClockMhz: number | null;
  vramGb: number | null;
  memoryType: string | null;
  memoryBusBits: number | null;
  bandwidthGbps: number | null;
  busInterface: string | null;
  pcieVersion: number | null;
  pcieLanes: number | null;
  tdpWatt: number | null;
  recommendedPsuW: number | null;
  formFactor: string;
  isWorkstation: boolean;
  supportsRayTracing: boolean;
  dlssVersion: number | null;
  fsrVersion: number | null;
  supportsXess: boolean;
  supportsFrameGen: boolean;
  supportsMultiFrameGen: boolean;
  supportsAv1Encode: boolean;
  supportsAv1Decode: boolean;
  supportsCuda: boolean;
  directxVersion: string | null;
  vulkanVersion: string | null;
  openglVersion: string | null;
  maxDisplays: number | null;
  coverUrl: string | null;
  description: string | null;
  content: string | null;
  gamingIndex: number | null;
  computeIndex: number | null;
  msrpUsd: number | null;
  quality: string;
  benchmarkScores: PublicGpuBenchmarkScore[];
  gamePerformance: GpuGamePerformance[];
};

async function gpusGet<T>(path: string): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchGpuBySlug(slug: string) {
  return gpusGet<PublicGpuDetail>(`hardware/gpus/${encodePathSegment(slug)}`);
}

function formatPlaceholderValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) {
    return value.length ? value.map(String).join("، ") : "—";
  }
  if (typeof value === "boolean") return value ? "بله" : "خیر";
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? value.toLocaleString("fa-IR")
      : value.toLocaleString("fa-IR", { maximumFractionDigits: 1 });
  }
  return String(value);
}

/** Replace `{{fieldName}}` tokens in TipTap HTML with live GPU values. */
export function applyGpuContentPlaceholders(
  html: string,
  gpu: PublicGpuDetail,
): string {
  const values: Record<string, unknown> = {
    name: gpu.name,
    vendor: gpu.vendor,
    family: gpu.family,
    series: gpu.series,
    generation: gpu.generation,
    architecture: gpu.architecture,
    codename: gpu.codename,
    chip: gpu.chip,
    shadingUnits: gpu.shadingUnits,
    baseClockMhz: gpu.baseClockMhz,
    boostClockMhz: gpu.boostClockMhz,
    gameClockMhz: gpu.gameClockMhz,
    memoryClockMhz: gpu.memoryClockMhz,
    vramGb: gpu.vramGb,
    memoryType: gpu.memoryType,
    memoryBusBits: gpu.memoryBusBits,
    bandwidthGbps: gpu.bandwidthGbps,
    busInterface: gpu.busInterface,
    pcieVersion: gpu.pcieVersion,
    pcieLanes: gpu.pcieLanes,
    tdpWatt: gpu.tdpWatt,
    recommendedPsuW: gpu.recommendedPsuW,
    formFactor: gpu.formFactor,
    isWorkstation: gpu.isWorkstation,
    supportsRayTracing: gpu.supportsRayTracing,
    dlssVersion: gpu.dlssVersion,
    fsrVersion: gpu.fsrVersion,
    supportsXess: gpu.supportsXess,
    supportsFrameGen: gpu.supportsFrameGen,
    supportsMultiFrameGen: gpu.supportsMultiFrameGen,
    gamingIndex: gpu.gamingIndex,
    computeIndex: gpu.computeIndex,
    msrpUsd: gpu.msrpUsd,
  };

  return html.replace(/\{\{(\w+)\}\}/g, (_match, key: string) =>
    formatPlaceholderValue(values[key]),
  );
}

export function buildGeneratedGpuSummary(gpu: PublicGpuDetail): string {
  const parts: string[] = [];
  parts.push(
    `${gpu.name} کارت گرافیکی از خانواده ${gpu.family ?? gpu.vendor} است`,
  );

  if (gpu.vramGb != null) {
    const mem = gpu.memoryType
      ? `${gpu.vramGb.toLocaleString("fa-IR")} گیگابایت حافظه ${gpu.memoryType}`
      : `${gpu.vramGb.toLocaleString("fa-IR")} گیگابایت حافظه گرافیکی`;
    parts.push(`که از ${mem} پشتیبانی می‌کند`);
  }

  if (gpu.boostClockMhz != null) {
    parts.push(
      `فرکانس بوست آن به ${gpu.boostClockMhz.toLocaleString("fa-IR")} مگاهرتز می‌رسد`,
    );
  }

  if (gpu.tdpWatt != null) {
    parts.push(
      `و توان حرارتی‌اش حدود ${gpu.tdpWatt.toLocaleString("fa-IR")} وات است`,
    );
  }

  if (gpu.supportsRayTracing) {
    parts.push("و از رهگیری پرتو پشتیبانی می‌کند");
  }

  return `${parts.join(" ")}.`;
}

export type GpuScoreCard = {
  key: string;
  label: string;
  value: string;
  hint?: string;
};

export function buildGpuScoreCards(gpu: PublicGpuDetail): GpuScoreCard[] {
  const cards: GpuScoreCard[] = [];

  if (gpu.gamingIndex != null) {
    cards.push({
      key: "gamingIndex",
      label: "شاخص گیمینگ",
      value: Math.round(gpu.gamingIndex).toLocaleString("fa-IR"),
      hint: "۰ تا ۱۰۰",
    });
  }
  if (gpu.computeIndex != null) {
    cards.push({
      key: "computeIndex",
      label: "شاخص محاسباتی",
      value: Math.round(gpu.computeIndex).toLocaleString("fa-IR"),
    });
  }

  const bestBySlug = new Map<string, PublicGpuBenchmarkScore>();
  for (const row of gpu.benchmarkScores ?? []) {
    const prev = bestBySlug.get(row.benchmark.slug);
    if (!prev || row.score > prev.score) {
      bestBySlug.set(row.benchmark.slug, row);
    }
  }

  for (const row of bestBySlug.values()) {
    cards.push({
      key: row.benchmark.slug,
      label: row.benchmark.name,
      value: Math.round(row.score).toLocaleString("fa-IR"),
      hint: row.benchmark.unit,
    });
  }

  return cards;
}

export type GpuSpecRow = { label: string; value: string };

export function buildGpuSpecRows(gpu: PublicGpuDetail): GpuSpecRow[] {
  const rows: Array<[string, unknown]> = [
    ["نام", gpu.name],
    ["سازنده", gpu.vendor],
    ["خانواده", gpu.family],
    ["سری", gpu.series],
    ["نسل", gpu.generation],
    ["معماری", gpu.architecture],
    ["Codename", gpu.codename],
    ["Chip", gpu.chip],
    [
      "تاریخ عرضه",
      gpu.releaseDate
        ? new Date(gpu.releaseDate).toLocaleDateString("fa-IR")
        : null,
    ],
    ["Shading Units", gpu.shadingUnits],
    ["TMUs", gpu.tmus],
    ["ROPs", gpu.rops],
    ["Tensor Cores", gpu.tensorCores],
    ["RT Cores", gpu.rayTracingCores],
    ["فرکانس پایه (MHz)", gpu.baseClockMhz],
    ["فرکانس بوست (MHz)", gpu.boostClockMhz],
    ["Game Clock (MHz)", gpu.gameClockMhz],
    ["Memory Clock (MHz)", gpu.memoryClockMhz],
    ["VRAM (GB)", gpu.vramGb],
    ["نوع حافظه", gpu.memoryType],
    ["عرض باس حافظه (bit)", gpu.memoryBusBits],
    ["پهنای باند (GB/s)", gpu.bandwidthGbps],
    ["باس", gpu.busInterface],
    ["نسخه PCIe", gpu.pcieVersion],
    ["خطوط PCIe", gpu.pcieLanes],
    ["TDP (W)", gpu.tdpWatt],
    ["PSU پیشنهادی (W)", gpu.recommendedPsuW],
    ["فرم‌فکتور", gpu.formFactor],
    ["Workstation", gpu.isWorkstation],
    ["Ray Tracing", gpu.supportsRayTracing],
    ["DLSS", gpu.dlssVersion],
    ["FSR", gpu.fsrVersion],
    ["XeSS", gpu.supportsXess],
    ["Frame Generation", gpu.supportsFrameGen],
    ["Multi Frame Gen", gpu.supportsMultiFrameGen],
    ["AV1 Encode", gpu.supportsAv1Encode],
    ["AV1 Decode", gpu.supportsAv1Decode],
    ["CUDA", gpu.supportsCuda],
    ["DirectX", gpu.directxVersion],
    ["Vulkan", gpu.vulkanVersion],
    ["OpenGL", gpu.openglVersion],
    ["حداکثر مانیتور", gpu.maxDisplays],
    ["MSRP (USD)", gpu.msrpUsd],
  ];

  return rows
    .map(([label, value]) => ({
      label,
      value: formatPlaceholderValue(value),
    }))
    .filter((row) => row.value !== "—");
}

export const PRESET_LABELS: Record<QualityPreset, string> = {
  LOW: "کم",
  MEDIUM: "متوسط",
  HIGH: "بالا",
  ULTRA: "اولترا",
};

export const RESOLUTION_LABELS: Record<string, string> = {
  R720P: "720p",
  R1080P: "1080p",
  R1440P: "1440p",
  R2160P: "4K",
  UW1440P: "UW 1440p",
  UW2160P: "UW 4K",
};
