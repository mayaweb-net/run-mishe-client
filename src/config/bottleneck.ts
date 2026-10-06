import { apiPost } from "@/lib/api-client";
import type { SearchOption } from "@/lib/catalog-search";

export type BottleneckSelection = {
  gpu: SearchOption | null;
  cpu: SearchOption | null;
  ram: number;
};

export const defaultBottleneckSelection: BottleneckSelection = {
  gpu: {
    id: "",
    name: "NVIDIA GeForce RTX 4060",
  },
  cpu: {
    id: "",
    name: "AMD Ryzen 5 3600",
  },
  ram: 16,
};

export const ramOptions = [8, 16, 32, 64] as const;

export type BottleneckResult = {
  hardwareSummary: string;
  cpuName: string;
  gpuName: string;
  cpuIndex: number;
  gpuIndex: number;
  limitedBy: "CPU" | "GPU";
  percent: number;
  label: string;
  warnings: string[];
  shareCode: string;
  sharePath: string;
};

type BottleneckApiResponse = {
  method: "parts-balance";
  warnings: string[];
  limitedBy: "CPU" | "GPU";
  percent: number;
  label: string;
  cpu: { id: string; name: string; gamingIndex: number };
  gpu: { id: string; name: string; gamingIndex: number };
  ramGb: number;
  shareCode: string;
  sharePath: string;
};

export function mapBottleneckToResult(
  api: BottleneckApiResponse,
): BottleneckResult {
  return {
    hardwareSummary: `${api.gpu.name} + ${api.cpu.name} · ${api.ramGb} GB RAM`,
    cpuName: api.cpu.name,
    gpuName: api.gpu.name,
    cpuIndex: api.cpu.gamingIndex,
    gpuIndex: api.gpu.gamingIndex,
    limitedBy: api.limitedBy,
    percent: api.percent,
    label: api.label,
    warnings: api.warnings,
    shareCode: api.shareCode,
    sharePath: api.sharePath,
  };
}

export async function fetchBottleneck(
  selection: BottleneckSelection,
): Promise<BottleneckApiResponse> {
  const body: Record<string, unknown> = {
    ramGb: selection.ram,
  };

  if (selection.gpu?.id) body.gpuId = selection.gpu.id;
  else if (selection.gpu?.name) body.gpuQuery = selection.gpu.name;

  if (selection.cpu?.id) body.cpuId = selection.cpu.id;
  else if (selection.cpu?.name) body.cpuQuery = selection.cpu.name;

  return apiPost<BottleneckApiResponse>("/bottleneck", body);
}
