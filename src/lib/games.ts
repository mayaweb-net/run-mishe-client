import { buildApiUrl } from "@/lib/api-client";
import { encodePathSegment } from "@/lib/site";

export type RequirementTier = "MINIMUM" | "RECOMMENDED" | "HIGH" | "ULTRA";

export type PublicGameRequirementOption = {
  id: string;
  kind: "CPU" | "GPU";
  matchedText: string;
  matchScore: number;
  needsReview: boolean;
  cpu: { id: string; name: string } | null;
  gpu: { id: string; name: string } | null;
};

export type PublicGameRequirement = {
  tier: RequirementTier;
  rawCpuText: string | null;
  rawGpuText: string | null;
  os: string | null;
  ramGb: number | null;
  vramGb: number | null;
  storageGb: number | null;
  directX: string | null;
  needsSsd: boolean;
  notes: string | null;
  options: PublicGameRequirementOption[];
};

export type PublicGameListItem = {
  id: string;
  slug: string;
  name: string;
  nameFa: string | null;
  coverUrl: string | null;
  demandTier: string;
  isPopular: boolean;
  releaseDate: string | null;
  genres?: string[];
  description?: string | null;
};

export type PublicGameDetail = {
  id: string;
  slug: string;
  name: string;
  nameFa: string | null;
  releaseDate: string | null;
  engine: string | null;
  developer: string | null;
  publisher: string | null;
  genres: string[];
  coverUrl: string | null;
  description: string | null;
  content: string | null;
  galleryPaths: string[];
  steamAppId: number | null;
  demandTier: string;
  isPopular: boolean;
  requirements: PublicGameRequirement[];
};

export type PublicGamesListResponse = {
  items: PublicGameListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

async function gamesGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const res = await fetch(buildApiUrl(path, params), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchPublishedGames(params?: {
  page?: number;
  limit?: number;
  q?: string;
}) {
  return gamesGet<PublicGamesListResponse>("games", {
    page: params?.page ?? 1,
    limit: params?.limit ?? 24,
    q: params?.q?.trim() || undefined,
    sortBy: "popularity",
    sortOrder: "desc",
  });
}

export async function fetchPublishedGame(slug: string) {
  return gamesGet<PublicGameDetail>(`games/${encodePathSegment(slug)}`);
}

export const requirementTierLabels: Record<RequirementTier, string> = {
  MINIMUM: "حداقل سیستم",
  RECOMMENDED: "سیستم پیشنهادی",
  HIGH: "کیفیت بالا",
  ULTRA: "نهایت کیفیت",
};

export const requirementSkillLabels: Record<RequirementTier, string> = {
  MINIMUM: "قابل اجرا",
  RECOMMENDED: "روان و پایدار",
  HIGH: "کیفیت بالا",
  ULTRA: "حداکثر گرافیک",
};
