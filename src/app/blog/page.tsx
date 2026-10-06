import Link from "next/link";
import type { Metadata } from "next";
import {
  fetchArticleCategories,
  fetchPublishedArticles,
} from "@/lib/articles";
import {
  ArticleCardGrid,
  ArticleCategoryNav,
} from "./_components/blog-ui";

export const metadata: Metadata = {
  title: "بلاگ",
  description: "مقالات و راهنماهای ران می‌شه",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [articlesResult, categoriesResult] = await Promise.allSettled([
    fetchPublishedArticles({ page, limit: 12 }),
    fetchArticleCategories(),
  ]);

  const data =
    articlesResult.status === "fulfilled" ? articlesResult.value : null;
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">بلاگ</h1>
        <p className="text-sm text-muted-foreground">
          تازه‌ترین نوشته‌ها و راهنماهای سخت‌افزار و گیمینگ
        </p>
      </header>

      <ArticleCategoryNav categories={categories} />

      {!data ? (
        <p className="text-sm text-destructive">
          دریافت مقالات با خطا مواجه شد. کمی بعد دوباره تلاش کنید.
        </p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          هنوز مقاله‌ای منتشر نشده است.
        </p>
      ) : (
        <ArticleCardGrid items={items} />
      )}

      {meta && meta.totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3">
          {page > 1 ? (
            <Link
              href={`/blog?page=${page - 1}`}
              className="text-sm text-primary hover:underline"
            >
              قبلی
            </Link>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            صفحه {meta.page.toLocaleString("fa-IR")} از{" "}
            {meta.totalPages.toLocaleString("fa-IR")}
          </span>
          {page < meta.totalPages ? (
            <Link
              href={`/blog?page=${page + 1}`}
              className="text-sm text-primary hover:underline"
            >
              بعدی
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </section>
  );
}
