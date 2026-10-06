import { apiGet } from "@/lib/api-client";

export type CpuMatrixCpu = {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  family: string | null;
  series: string | null;
  generation: number | null;
  socket: string | null;
  formFactor: string;
  performanceCores: number | null;
  efficiencyCores: number | null;
  threads: number | null;
  tdpWatt: number | null;
  isX3d: boolean;
  isUnlocked: boolean;
  gamingIndex: number | null;
  quality: string;
  releaseDate: string | null;
  createdAt: string;
};

export type CpuMatrixColumn = {
  id: string;
  slug: string;
  name: string;
  nameFa: string | null;
};

export type CpuMatrixResponse = {
  mode: "benchmark";
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  columns: CpuMatrixColumn[];
  rows: Array<{
    cpu: CpuMatrixCpu;
    values: Array<number | null>;
  }>;
};

export type CpuMatrixQuery = {
  page?: number;
  limit?: number;
  q?: string;
  vendor?: string;
  formFactor?: string;
  socket?: string;
  family?: string;
  isX3d?: boolean;
  isUnlocked?: boolean;
  sortBy?: "name" | "gamingIndex" | "createdAt" | "releaseDate";
  sortOrder?: "asc" | "desc";
};

export const vendorOptions = [
  { value: "AMD", label: "AMD" },
  { value: "INTEL", label: "Intel" },
] as const;

export const formFactorOptions = [
  { value: "DESKTOP", label: "دسکتاپ" },
  { value: "LAPTOP", label: "لپ‌تاپ" },
] as const;

/** Exact `socket` values present in current CPU catalog. */
export const socketOptions = [
  { value: "AM5", label: "AM5" },
  { value: "AM4", label: "AM4" },
  { value: "AM3+", label: "AM3+" },
  { value: "LGA 1851", label: "LGA 1851" },
  { value: "LGA 1700", label: "LGA 1700" },
  { value: "LGA 1200", label: "LGA 1200" },
  { value: "LGA 1151", label: "LGA 1151" },
  { value: "LGA 1155", label: "LGA 1155" },
  { value: "LGA 1150", label: "LGA 1150" },
  { value: "FM2+", label: "FM2+" },
] as const;

/** Family prefixes matched with startsWith on the server. */
export const familyOptions = [
  { value: "Ryzen 9", label: "Ryzen 9" },
  { value: "Ryzen 7", label: "Ryzen 7" },
  { value: "Ryzen 5", label: "Ryzen 5" },
  { value: "Ryzen 3", label: "Ryzen 3" },
  { value: "Core Ultra 9", label: "Core Ultra 9" },
  { value: "Core Ultra 7", label: "Core Ultra 7" },
  { value: "Core Ultra 5", label: "Core Ultra 5" },
  { value: "Core i9", label: "Core i9" },
  { value: "Core i7", label: "Core i7" },
  { value: "Core i5", label: "Core i5" },
  { value: "Core i3", label: "Core i3" },
] as const;

export function fetchCpuMatrix(query: CpuMatrixQuery) {
  return apiGet<CpuMatrixResponse>("/hardware/cpus/matrix", {
    page: query.page,
    limit: query.limit ?? 25,
    q: query.q,
    vendor: query.vendor,
    formFactor: query.formFactor ?? "DESKTOP",
    socket: query.socket,
    family: query.family,
    isX3d: query.isX3d,
    isUnlocked: query.isUnlocked,
    sortBy: query.sortBy ?? "gamingIndex",
    sortOrder: query.sortOrder ?? "desc",
  });
}

export function formatMatrixValue(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return Math.round(value).toLocaleString("en-US");
}

export function vendorLabel(vendor: string) {
  if (vendor === "AMD") return "AMD";
  if (vendor === "INTEL") return "Intel";
  return vendor;
}
