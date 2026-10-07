import Link from "next/link";
import type { Metadata } from "next";
import { fetchPublishedGames } from "@/lib/games";
import { GameCardGrid } from "./_components/game-ui";

export const metadata: Metadata = {
  title: "بازی‌ها",
  description: "بررسی سیستم موردنیاز و صفحه هر بازی در ران می‌شه",
};

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  let data: Awaited<ReturnType<typeof fetchPublishedGames>> | null = null;
  try {
    data = await fetchPublishedGames({ page, limit: 24 });
  } catch {
    data = null;
  }

  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">بازی‌ها</h1>
        <p className="text-sm text-muted-foreground">
          صفحه بررسی هر بازی، سیستم موردنیاز و گالری تصاویر
        </p>
      </header>

      {!data ? (
        <p className="text-sm text-destructive">
          دریافت لیست بازی‌ها با خطا مواجه شد. کمی بعد دوباره تلاش کنید.
        </p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          هنوز بازی منتشرشده‌ای وجود ندارد.
        </p>
      ) : (
        <GameCardGrid items={items} />
      )}

      {meta && meta.totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3">
          {page > 1 ? (
            <Link
              href={`/games?page=${page - 1}`}
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
              href={`/games?page=${page + 1}`}
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
