import { apiGet } from "@/lib/api-client";

export type SearchOption = {
  id: string;
  name: string;
  subtitle?: string;
};

type Paginated<T> = {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

function rankByQuery<T extends { name: string }>(
  items: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return [...items].sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const score = (name: string) => {
      if (name === q) return 0;
      if (name.startsWith(q)) return 1;
      const idx = name.indexOf(q);
      if (idx >= 0) return 2 + idx / 100;
      return 50 + name.length / 100;
    };
    const diff = score(aName) - score(bName);
    if (diff !== 0) return diff;
    return aName.length - bName.length || aName.localeCompare(bName);
  });
}

export async function searchGames(query: string): Promise<SearchOption[]> {
  const q = query.trim();
  const result = await apiGet<
    Paginated<{
      id: string;
      name: string;
      nameFa: string | null;
      demandTier: string;
    }>
  >("/games", {
    q: q || undefined,
    limit: 12,
    page: 1,
    sortBy: q ? "name" : "popularity",
    sortOrder: q ? "asc" : "asc",
    isPublished: true,
  });

  return rankByQuery(result.items, q).map((item) => ({
    id: item.id,
    name: item.name,
    subtitle: item.nameFa ?? item.demandTier,
  }));
}

export async function searchCpus(query: string): Promise<SearchOption[]> {
  const q = query.trim();
  const result = await apiGet<
    Paginated<{
      id: string;
      name: string;
      gamingIndex: number | null;
      vendor: string;
    }>
  >("/hardware/cpus", {
    q: q || undefined,
    limit: 12,
    page: 1,
    sortBy: q ? "name" : "gamingIndex",
    sortOrder: q ? "asc" : "desc",
  });

  return rankByQuery(result.items, q).map((item) => ({
    id: item.id,
    name: item.name,
    subtitle:
      item.gamingIndex != null
        ? `Index ${item.gamingIndex.toFixed(1)}`
        : item.vendor,
  }));
}

export async function searchGpus(query: string): Promise<SearchOption[]> {
  const q = query.trim();
  const result = await apiGet<
    Paginated<{
      id: string;
      name: string;
      gamingIndex: number | null;
      vendor: string;
    }>
  >("/hardware/gpus", {
    q: q || undefined,
    limit: 12,
    page: 1,
    sortBy: q ? "name" : "gamingIndex",
    sortOrder: q ? "asc" : "desc",
  });

  return rankByQuery(result.items, q).map((item) => ({
    id: item.id,
    name: item.name,
    subtitle:
      item.gamingIndex != null
        ? `Index ${item.gamingIndex.toFixed(1)}`
        : item.vendor,
  }));
}
