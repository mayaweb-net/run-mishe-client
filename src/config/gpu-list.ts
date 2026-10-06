import { apiGet } from "@/lib/api-client";

export type GpuMatrixMode = "fps" | "benchmark";

export type ApiResolution = "R720P" | "R1080P" | "R1440P" | "R2160P";
export type QualityPreset = "LOW" | "MEDIUM" | "HIGH" | "ULTRA";

export type GpuMatrixGpu = {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  family: string | null;
  series: string | null;
  generation: number | null;
  formFactor: string;
  vramGb: number | null;
  memoryType: string | null;
  tdpWatt: number | null;
  gamingIndex: number | null;
  supportsRayTracing: boolean;
  dlssVersion: number | null;
  fsrVersion: number | null;
  supportsFrameGen: boolean;
};

export type GpuMatrixColumn = {
  id: string;
  slug: string;
  name: string;
  nameFa: string | null;
};

export type GpuMatrixResponse = {
  mode: GpuMatrixMode;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  cpu: {
    id: string;
    slug: string;
    name: string;
    gamingIndex: number;
  } | null;
  settings: {
    resolution: ApiResolution;
    preset: QualityPreset;
    ramGb: number;
  } | null;
  columns: GpuMatrixColumn[];
  rows: Array<{
    gpu: GpuMatrixGpu;
    values: Array<number | null>;
  }>;
};

export type GpuMatrixQuery = {
  mode: GpuMatrixMode;
  page?: number;
  limit?: number;
  q?: string;
  vendor?: string;
  formFactor?: string;
  family?: string;
  vramMin?: number;
  vramMax?: number;
  supportsRayTracing?: boolean;
  memoryType?: string;
  resolution?: ApiResolution;
  preset?: QualityPreset;
  sortBy?: "name" | "gamingIndex" | "createdAt" | "releaseDate" | "vramGb";
  sortOrder?: "asc" | "desc";
};

export const vendorOptions = [
  { value: "NVIDIA", label: "NVIDIA" },
  { value: "AMD", label: "AMD" },
  { value: "INTEL", label: "Intel" },
] as const;

export const formFactorOptions = [
  { value: "DESKTOP", label: "دسکتاپ" },
  { value: "LAPTOP", label: "لپ‌تاپ" },
] as const;

/** Exact `family` values present in current GPU catalog. */
export const familyOptions = [
  { value: "GeForce 50", label: "GeForce RTX 50" },
  { value: "GeForce 40", label: "GeForce RTX 40" },
  { value: "GeForce 30", label: "GeForce RTX 30" },
  { value: "GeForce 20", label: "GeForce RTX 20" },
  { value: "GeForce 16", label: "GeForce GTX 16" },
  { value: "GeForce 10", label: "GeForce GTX 10" },
  { value: "Navi IV(RX 9000)", label: "Radeon RX 9000" },
  { value: "Navi III(RX 7000)", label: "Radeon RX 7000" },
  { value: "Navi II(RX 6000)", label: "Radeon RX 6000" },
  { value: "Navi(RX 5000)", label: "Radeon RX 5000" },
] as const;

export const resolutionOptions: Array<{ value: ApiResolution; label: string }> =
  [
    { value: "R720P", label: "720p" },
    { value: "R1080P", label: "1080p" },
    { value: "R1440P", label: "1440p" },
    { value: "R2160P", label: "4K" },
  ];

export const presetOptions: Array<{ value: QualityPreset; label: string }> = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "ULTRA", label: "Ultra" },
];

export const memoryTypeOptions = [
  { value: "GDDR7", label: "GDDR7" },
  { value: "GDDR6X", label: "GDDR6X" },
  { value: "GDDR6", label: "GDDR6" },
  { value: "GDDR5X", label: "GDDR5X" },
  { value: "GDDR5", label: "GDDR5" },
] as const;

export const vramOptions = [
  { value: "4", label: "۴ گیگ" },
  { value: "6", label: "۶ گیگ" },
  { value: "8", label: "۸ گیگ" },
  { value: "12", label: "۱۲ گیگ" },
  { value: "16", label: "۱۶ گیگ" },
  { value: "24", label: "۲۴ گیگ" },
] as const;

export function fetchGpuMatrix(query: GpuMatrixQuery) {
  return apiGet<GpuMatrixResponse>("/hardware/gpus/matrix", {
    mode: query.mode,
    page: query.page,
    limit: query.limit ?? 25,
    q: query.q,
    vendor: query.vendor,
    formFactor: query.formFactor ?? "DESKTOP",
    family: query.family,
    vramMin: query.vramMin,
    vramMax: query.vramMax,
    supportsRayTracing: query.supportsRayTracing,
    memoryType: query.memoryType,
    resolution: query.mode === "fps" ? (query.resolution ?? "R1080P") : undefined,
    preset: query.mode === "fps" ? (query.preset ?? "HIGH") : undefined,
    sortBy: query.sortBy ?? "gamingIndex",
    sortOrder: query.sortOrder ?? "desc",
  });
}

export function formatMatrixValue(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return Math.round(value).toLocaleString("en-US");
}

export function vendorLabel(vendor: string) {
  if (vendor === "NVIDIA") return "NVIDIA";
  if (vendor === "AMD") return "AMD";
  if (vendor === "INTEL") return "Intel";
  return vendor;
}
