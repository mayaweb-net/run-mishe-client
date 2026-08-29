export type FpsInput = {
  game: string;
  gpu: string;
  cpu: string;
  ram: string;
};

export const defaultFpsInput: FpsInput = {
  game: "Red Dead Redemption 2",
  gpu: "Nvidia Geforce RTX 4060",
  cpu: "Intel Core i7-13500",
  ram: "32",
};

export const ramOptions = ["8", "16", "32", "64", "128"] as const;

export type ResolutionId = "720p" | "1080p" | "1440p" | "4k";

export type ResolutionFps = {
  id: ResolutionId;
  label: string;
  fps: number;
  tone: "great" | "active" | "moderate" | "low";
};

export type FpsResult = {
  game: string;
  hardwareSummary: string;
  quality: string;
  resolutionLabel: string;
  estimatedFps: number;
  fpsRange: { min: number; max: number };
  statusLabel: string;
  resolutions: ResolutionFps[];
};

const mockResolutions: ResolutionFps[] = [
  { id: "720p", label: "720p", fps: 128, tone: "great" },
  { id: "1080p", label: "1080p", fps: 71, tone: "active" },
  { id: "1440p", label: "1440p", fps: 46, tone: "moderate" },
  { id: "4k", label: "4K", fps: 27, tone: "low" },
];

export function getFpsResult(input: FpsInput, resolution: ResolutionId): FpsResult {
  const resolutionData =
    mockResolutions.find((item) => item.id === resolution) ?? mockResolutions[1];

  const variance = resolution === "4k" ? 4 : resolution === "1440p" ? 6 : 7;

  return {
    game: input.game.trim() || defaultFpsInput.game,
    hardwareSummary: `${input.gpu.trim() || defaultFpsInput.gpu} + ${input.cpu.trim() || defaultFpsInput.cpu} + ${input.ram || defaultFpsInput.ram} GB RAM`,
    quality: "High",
    resolutionLabel: resolutionData.label,
    estimatedFps: resolutionData.fps,
    fpsRange: {
      min: resolutionData.fps - variance,
      max: resolutionData.fps + variance,
    },
    statusLabel: resolutionData.fps >= 60 ? "خوب — روان" : "متوسط — قابل قبول",
    resolutions: mockResolutions.map((item) => ({
      ...item,
      tone: item.id === resolution ? "active" : item.tone,
    })),
  };
}
