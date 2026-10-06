import { buildApiUrl } from "@/lib/api-client";
import { encodePathSegment } from "@/lib/site";

export type PublicArticleCategory = {
  id: string;
  name: string;
  slug: string;
};

export type PublicArticleCategoryListItem = PublicArticleCategory & {
  description: string | null;
  articleCount: number;
};

export type PublicArticleCategoryDetail = PublicArticleCategory & {
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  noIndex: boolean;
  updatedAt: string;
};

export type PublicArticleListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverPath: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorName: string | null;
  category: PublicArticleCategory | null;
};

export type PublicArticle = PublicArticleListItem & {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
};

export type PublicArticlesListResponse = {
  items: PublicArticleListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

async function articlesGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
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

export async function fetchPublishedArticles(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  return articlesGet<PublicArticlesListResponse>("articles", {
    page: params?.page ?? 1,
    limit: params?.limit ?? 12,
    search: params?.search?.trim() || undefined,
    category: params?.category?.trim() || undefined,
  });
}

export async function fetchPublishedArticle(slug: string) {
  const data = await articlesGet<{ article: PublicArticle }>(
    `articles/${encodePathSegment(slug)}`,
  );
  return data.article;
}

export async function fetchArticleCategories() {
  const data = await articlesGet<{ items: PublicArticleCategoryListItem[] }>(
    "articles/categories",
  );
  return data.items;
}

export async function fetchArticleCategory(slug: string) {
  const data = await articlesGet<{ category: PublicArticleCategoryDetail }>(
    `articles/categories/${encodePathSegment(slug)}`,
  );
  return data.category;
}
