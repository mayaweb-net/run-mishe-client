import Link from "next/link";
import { getFileUrl } from "@/lib/site";
import type { PublicArticleListItem } from "@/lib/articles";
import { cn } from "@/lib/utils";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("fa-IR");
}

type ArticleCardGridProps = {
  items: PublicArticleListItem[];
};

export function ArticleCardGrid({ items }: ArticleCardGridProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((article) => {
        const cover = getFileUrl(article.coverPath);
        const date = formatDate(article.publishedAt ?? article.createdAt);
        return (
          <li key={article.id}>
            <Link
              href={`/blog/${article.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-background transition hover:border-primary/40"
            >
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover}
                  alt=""
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/9] w-full bg-muted" />
              )}
              <div className="flex flex-1 flex-col gap-2 p-4">
                {article.category ? (
                  <span className="text-xs font-medium text-primary">
                    {article.category.name}
                  </span>
                ) : null}
                <h2 className="text-base font-semibold leading-snug group-hover:text-primary">
                  {article.title}
                </h2>
                {article.excerpt ? (
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                ) : null}
                <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                  <span>{article.authorName?.trim() || "ران می‌شه"}</span>
                  {date ? (
                    <time dateTime={article.publishedAt ?? article.createdAt}>
                      {date}
                    </time>
                  ) : null}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

type ArticleCategoryNavProps = {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    articleCount: number;
  }>;
  activeSlug?: string | null;
  className?: string;
  variant?: "chips" | "sidebar";
};

export function ArticleCategoryNav({
  categories,
  activeSlug,
  className,
  variant = "chips",
}: ArticleCategoryNavProps) {
  if (categories.length === 0) return null;

  if (variant === "sidebar") {
    return (
      <nav
        aria-label="دسته‌بندی مقالات"
        className={cn("flex flex-col gap-1", className)}
      >
        <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground">
          دسته‌بندی‌ها
        </p>
        <Link
          href="/blog"
          className={cn(
            "rounded-lg px-3 py-2 text-sm transition-colors",
            !activeSlug
              ? "bg-primary/10 font-medium text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          همه مقالات
        </Link>
        {categories.map((category) => {
          const active = category.slug === activeSlug;
          return (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span>{category.name}</span>
              <span className="text-xs tabular-nums opacity-70">
                {category.articleCount.toLocaleString("fa-IR")}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      aria-label="دسته‌بندی مقالات"
      className={cn("flex flex-wrap gap-2", className)}
    >
      <Link
        href="/blog"
        className={cn(
          "rounded-full border px-3 py-1.5 text-sm transition-colors",
          !activeSlug
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
        )}
      >
        همه
      </Link>
      {categories.map((category) => {
        const active = category.slug === activeSlug;
        return (
          <Link
            key={category.id}
            href={`/blog/category/${category.slug}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}
