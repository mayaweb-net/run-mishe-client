import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchArticleCategories,
  fetchArticleCategory,
  fetchPublishedArticles,
} from "@/lib/articles";
import { SITE_URL } from "@/lib/site";
import {
  ArticleCardGrid,
  ArticleCategoryNav,
} from "../../_components/blog-ui";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const category = await fetchArticleCategory(slug);
    const title = category.metaTitle?.trim() || category.name;
    const description =
      category.metaDescription?.trim() ||
      category.description?.trim() ||
      `مقالات دسته ${category.name}`;
    const canonical = `${SITE_URL}/blog/category/${category.slug}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: "website",
        url: canonical,
      },
      robots: category.noIndex
        ? { index: false, follow: true }
        : { index: true, follow: true },
    };
  } catch {
    return {
      title: "دسته‌بندی یافت نشد",
      robots: { index: false, follow: false },
    };
  }
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);

  let category: Awaited<ReturnType<typeof fetchArticleCategory>>;
  try {
    category = await fetchArticleCategory(slug);
  } catch {
    notFound();
  }

  const [articlesResult, categoriesResult] = await Promise.allSettled([
    fetchPublishedArticles({ page, limit: 12, category: slug }),
    fetchArticleCategories(),
  ]);

  const data =
    articlesResult.status === "fulfilled" ? articlesResult.value : null;
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  const items = data?.items ?? [];
  const meta = data?.meta;
  const pageHref = (nextPage: number) =>
    nextPage <= 1
      ? `/blog/category/${category.slug}`
      : `/blog/category/${category.slug}?page=${nextPage}`;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          بازگشت به بلاگ
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>
        {category.description ? (
          <p className="text-sm text-muted-foreground">{category.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            مقالات دسته «{category.name}»
          </p>
        )}
      </header>

      <ArticleCategoryNav
        categories={categories}
        activeSlug={category.slug}
      />

      {!data ? (
        <p className="text-sm text-destructive">
          دریافت مقالات با خطا مواجه شد. کمی بعد دوباره تلاش کنید.
        </p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          در این دسته هنوز مقاله‌ای منتشر نشده است.
        </p>
      ) : (
        <ArticleCardGrid items={items} />
      )}

      {meta && meta.totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3">
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
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
              href={pageHref(page + 1)}
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
