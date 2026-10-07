import { buildApiUrl } from "@/lib/api-client";
import { encodePathSegment } from "@/lib/site";

export type PublicCpuBenchmarkScore = {
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

export type PublicCpuDetail = {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  family: string | null;
  series: string | null;
  generation: number | null;
  codename: string | null;
  architecture: string | null;
  socket: string | null;
  releaseDate: string | null;
  performanceCores: number;
  efficiencyCores: number;
  threads: number;
  baseClockMhz: number | null;
  boostClockMhz: number | null;
  l2CacheMb: number | null;
  l3CacheMb: number | null;
  tdpWatt: number | null;
  maxTempC: number | null;
  processNodeNm: number | null;
  formFactor: string;
  isUnlocked: boolean;
  isX3d: boolean;
  memoryTypes: string[];
  memoryChannels: number | null;
  maxMemoryGb: number | null;
  pcieVersion: number | null;
  pcieLanes: number | null;
  instructionSets: string[];
  coverUrl: string | null;
  description: string | null;
  content: string | null;
  singleThreadIndex: number | null;
  multiThreadIndex: number | null;
  gamingIndex: number | null;
  msrpUsd: number | null;
  quality: string;
  benchmarkScores: PublicCpuBenchmarkScore[];
};

async function cpusGet<T>(path: string): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchCpuBySlug(slug: string) {
  return cpusGet<PublicCpuDetail>(`hardware/cpus/${encodePathSegment(slug)}`);
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

/** Replace `{{fieldName}}` tokens in TipTap HTML with live CPU values. */
export function applyCpuContentPlaceholders(
  html: string,
  cpu: PublicCpuDetail,
): string {
  const values: Record<string, unknown> = {
    name: cpu.name,
    vendor: cpu.vendor,
    family: cpu.family,
    series: cpu.series,
    generation: cpu.generation,
    codename: cpu.codename,
    architecture: cpu.architecture,
    socket: cpu.socket,
    performanceCores: cpu.performanceCores,
    efficiencyCores: cpu.efficiencyCores,
    threads: cpu.threads,
    baseClockMhz: cpu.baseClockMhz,
    boostClockMhz: cpu.boostClockMhz,
    l2CacheMb: cpu.l2CacheMb,
    l3CacheMb: cpu.l3CacheMb,
    tdpWatt: cpu.tdpWatt,
    maxTempC: cpu.maxTempC,
    processNodeNm: cpu.processNodeNm,
    formFactor: cpu.formFactor,
    isUnlocked: cpu.isUnlocked,
    isX3d: cpu.isX3d,
    memoryTypes: cpu.memoryTypes,
    memoryChannels: cpu.memoryChannels,
    maxMemoryGb: cpu.maxMemoryGb,
    pcieVersion: cpu.pcieVersion,
    pcieLanes: cpu.pcieLanes,
    instructionSets: cpu.instructionSets,
    gamingIndex: cpu.gamingIndex,
    singleThreadIndex: cpu.singleThreadIndex,
    multiThreadIndex: cpu.multiThreadIndex,
    msrpUsd: cpu.msrpUsd,
  };

  return html.replace(/\{\{(\w+)\}\}/g, (_match, key: string) =>
    formatPlaceholderValue(values[key]),
  );
}

export function buildGeneratedCpuSummary(cpu: PublicCpuDetail): string {
  const parts: string[] = [];
  parts.push(
    `${cpu.name} پردازنده‌ای از خانواده ${cpu.family ?? cpu.vendor} است`,
  );

  const coreBits: string[] = [];
  if (cpu.performanceCores > 0) {
    coreBits.push(
      `${cpu.performanceCores.toLocaleString("fa-IR")} هسته عملکردی`,
    );
  }
  if (cpu.efficiencyCores > 0) {
    coreBits.push(
      `${cpu.efficiencyCores.toLocaleString("fa-IR")} هسته کم‌مصرف`,
    );
  }
  if (cpu.threads > 0) {
    coreBits.push(`${cpu.threads.toLocaleString("fa-IR")} رشته پردازشی`);
  }
  if (coreBits.length) {
    parts.push(`که از ${coreBits.join(" و ")} پشتیبانی می‌کند`);
  }

  if (cpu.boostClockMhz != null) {
    parts.push(
      `فرکانس بوست آن به ${cpu.boostClockMhz.toLocaleString("fa-IR")} مگاهرتز می‌رسد`,
    );
  }
  if (cpu.tdpWatt != null) {
    parts.push(`و توان حرارتی‌اش حدود ${cpu.tdpWatt.toLocaleString("fa-IR")} وات است`);
  }
  if (cpu.socket) {
    parts.push(`روی سوکت ${cpu.socket}`);
  }

  return `${parts.join(" ")}.`;
}

export type CpuScoreCard = {
  key: string;
  label: string;
  value: string;
  hint?: string;
};

export function buildCpuScoreCards(cpu: PublicCpuDetail): CpuScoreCard[] {
  const cards: CpuScoreCard[] = [];

  if (cpu.gamingIndex != null) {
    cards.push({
      key: "gamingIndex",
      label: "شاخص گیمینگ",
      value: Math.round(cpu.gamingIndex).toLocaleString("fa-IR"),
      hint: "۰ تا ۱۰۰",
    });
  }
  if (cpu.singleThreadIndex != null) {
    cards.push({
      key: "singleThreadIndex",
      label: "تک‌رشته",
      value: Math.round(cpu.singleThreadIndex).toLocaleString("fa-IR"),
    });
  }
  if (cpu.multiThreadIndex != null) {
    cards.push({
      key: "multiThreadIndex",
      label: "چندرشته",
      value: Math.round(cpu.multiThreadIndex).toLocaleString("fa-IR"),
    });
  }

  const bestBySlug = new Map<string, PublicCpuBenchmarkScore>();
  for (const row of cpu.benchmarkScores ?? []) {
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

export type CpuSpecRow = { label: string; value: string };

export function buildCpuSpecRows(cpu: PublicCpuDetail): CpuSpecRow[] {
  const rows: Array<[string, unknown]> = [
    ["نام", cpu.name],
    ["سازنده", cpu.vendor],
    ["خانواده", cpu.family],
    ["سری", cpu.series],
    ["نسل", cpu.generation],
    ["Codename", cpu.codename],
    ["معماری", cpu.architecture],
    ["سوکت", cpu.socket],
    [
      "تاریخ عرضه",
      cpu.releaseDate
        ? new Date(cpu.releaseDate).toLocaleDateString("fa-IR")
        : null,
    ],
    ["هسته عملکردی", cpu.performanceCores],
    ["هسته کم‌مصرف", cpu.efficiencyCores],
    ["رشته", cpu.threads],
    ["فرکانس پایه (MHz)", cpu.baseClockMhz],
    ["فرکانس بوست (MHz)", cpu.boostClockMhz],
    ["کش L2 (MB)", cpu.l2CacheMb],
    ["کش L3 (MB)", cpu.l3CacheMb],
    ["TDP (W)", cpu.tdpWatt],
    ["دمای حداکثر (°C)", cpu.maxTempC],
    ["فرآیند ساخت (nm)", cpu.processNodeNm],
    ["فرم‌فکتور", cpu.formFactor],
    ["Unlocked", cpu.isUnlocked],
    ["X3D", cpu.isX3d],
    ["نوع حافظه", cpu.memoryTypes],
    ["کانال حافظه", cpu.memoryChannels],
    ["حداکثر رم (GB)", cpu.maxMemoryGb],
    ["نسخه PCIe", cpu.pcieVersion],
    ["خطوط PCIe", cpu.pcieLanes],
    ["Instruction Sets", cpu.instructionSets],
    ["MSRP (USD)", cpu.msrpUsd],
  ];

  return rows
    .map(([label, value]) => ({
      label,
      value: formatPlaceholderValue(value),
    }))
    .filter((row) => row.value !== "—");
}
