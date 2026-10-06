import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchArticleCategories,
  fetchPublishedArticle,
} from "@/lib/articles";
import {
  sanitizeArticleHtml,
  stripHtml,
  truncateText,
} from "@/lib/sanitize-article-html";
import { SITE_URL, getFileUrl } from "@/lib/site";
import { ArticleCategoryNav } from "../_components/blog-ui";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await fetchPublishedArticle(slug);
    const title = article.metaTitle?.trim() || article.title;
    const description =
      article.metaDescription?.trim() ||
      article.excerpt?.trim() ||
      truncateText(stripHtml(article.content));
    const canonical =
      article.canonicalUrl?.trim() || `${SITE_URL}/blog/${article.slug}`;
    const cover = getFileUrl(article.coverPath);

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: "article",
        url: canonical,
        ...(cover ? { images: [{ url: cover }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(cover ? { images: [cover] } : {}),
      },
      robots: article.noIndex
        ? { index: false, follow: true }
        : { index: true, follow: true },
    };
  } catch {
    return {
      title: "مقاله یافت نشد",
      robots: { index: false, follow: false },
    };
  }
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let article: Awaited<ReturnType<typeof fetchPublishedArticle>>;
  try {
    article = await fetchPublishedArticle(slug);
  } catch {
    notFound();
  }

  let categories: Awaited<ReturnType<typeof fetchArticleCategories>> = [];
  try {
    categories = await fetchArticleCategories();
  } catch {
    categories = [];
  }

  const cover = getFileUrl(article.coverPath);
  const html = sanitizeArticleHtml(article.content);
  const dateValue = article.publishedAt ?? article.createdAt;
  const dateLabel = new Date(dateValue).toLocaleDateString("fa-IR");

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <article className="flex min-w-0 flex-col gap-6">
        <div>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            بازگشت به بلاگ
          </Link>
        </div>

        <header className="flex flex-col gap-3">
          {article.category ? (
            <Link
              href={`/blog/category/${article.category.slug}`}
              className="w-fit text-sm font-medium text-primary hover:underline"
            >
              {article.category.name}
            </Link>
          ) : null}
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>{article.authorName?.trim() || "ران می‌شه"}</span>
            <span aria-hidden>•</span>
            <time dateTime={dateValue}>{dateLabel}</time>
          </div>
          {article.excerpt ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          ) : null}
        </header>

        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
        ) : null}

        <div
          className="article-html-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="border-t pt-6 lg:hidden">
          <ArticleCategoryNav
            categories={categories}
            activeSlug={article.category?.slug}
            variant="sidebar"
          />
        </div>
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border bg-background p-4">
          <ArticleCategoryNav
            categories={categories}
            activeSlug={article.category?.slug}
            variant="sidebar"
          />
        </div>
      </aside>
    </div>
  );
}
