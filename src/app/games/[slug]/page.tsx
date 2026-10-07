import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchPublishedGame,
  type PublicGameRequirement,
} from "@/lib/games";
import {
  sanitizeArticleHtml,
  stripHtml,
  truncateText,
} from "@/lib/sanitize-article-html";
import { SITE_URL, getFileUrl } from "@/lib/site";
import {
  GameGallery,
  GameRequirementCard,
  GameSkillReviewCards,
} from "../_components/game-ui";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const game = await fetchPublishedGame(slug);
    const title = game.nameFa?.trim() || game.name;
    const description =
      game.description?.trim() ||
      truncateText(stripHtml(game.content ?? ""));
    const cover = getFileUrl(game.coverUrl);
    const canonical = `${SITE_URL}/games/${game.slug}`;

    return {
      title: `بررسی ${title}`,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: "website",
        url: canonical,
        ...(cover ? { images: [{ url: cover }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(cover ? { images: [cover] } : {}),
      },
    };
  } catch {
    return {
      title: "بازی یافت نشد",
      robots: { index: false, follow: false },
    };
  }
}

function findTier(
  requirements: PublicGameRequirement[],
  tier: PublicGameRequirement["tier"],
) {
  return requirements.find((item) => item.tier === tier) ?? null;
}

export default async function GameReviewPage({ params }: PageProps) {
  const { slug } = await params;

  let game: Awaited<ReturnType<typeof fetchPublishedGame>>;
  try {
    game = await fetchPublishedGame(slug);
  } catch {
    notFound();
  }

  const title = game.nameFa?.trim() || game.name;
  const cover = getFileUrl(game.coverUrl);
  const html = game.content ? sanitizeArticleHtml(game.content) : "";
  const minimum = findTier(game.requirements, "MINIMUM");
  const recommended = findTier(game.requirements, "RECOMMENDED");
  const releaseLabel = game.releaseDate
    ? new Date(game.releaseDate).toLocaleDateString("fa-IR")
    : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8">
      <div>
        <Link
          href="/games"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          بازگشت به بازی‌ها
        </Link>
      </div>

      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              {title}
            </h1>
            {game.nameFa && game.nameFa !== game.name ? (
              <p className="text-sm text-muted-foreground" dir="ltr">
                {game.name}
              </p>
            ) : null}
          </div>

          {game.description ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              {game.description}
            </p>
          ) : null}

          <dl className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {game.developer ? (
              <div>
                <dt className="inline">توسعه‌دهنده: </dt>
                <dd className="inline font-medium text-foreground">
                  {game.developer}
                </dd>
              </div>
            ) : null}
            {game.publisher ? (
              <div>
                <dt className="inline">ناشر: </dt>
                <dd className="inline font-medium text-foreground">
                  {game.publisher}
                </dd>
              </div>
            ) : null}
            {releaseLabel ? (
              <div>
                <dt className="inline">انتشار: </dt>
                <dd className="inline font-medium text-foreground">
                  {releaseLabel}
                </dd>
              </div>
            ) : null}
            {game.engine ? (
              <div>
                <dt className="inline">موتور: </dt>
                <dd className="inline font-medium text-foreground" dir="ltr">
                  {game.engine}
                </dd>
              </div>
            ) : null}
          </dl>

          {game.genres.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {game.genres.map((genre) => (
                <li
                  key={genre}
                  className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
                >
                  {genre}
                </li>
              ))}
            </ul>
          ) : null}

          <Link
            href={`/review?game=${encodeURIComponent(game.slug)}`}
            className="inline-flex w-fit items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            بررسی سیستم برای این بازی
          </Link>
        </div>

        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="aspect-[16/10] w-full rounded-2xl border object-cover"
          />
        ) : null}
      </header>

      {(minimum || recommended) && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">سیستم موردنیاز</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {minimum ? <GameRequirementCard requirement={minimum} /> : null}
            {recommended ? (
              <GameRequirementCard requirement={recommended} emphasize />
            ) : null}
          </div>
        </section>
      )}

      <GameSkillReviewCards
        requirements={game.requirements}
        gameSlug={game.slug}
      />

      <GameGallery paths={game.galleryPaths ?? []} />

      {html ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">توضیحات کامل</h2>
          <div
            className="article-html-content rounded-xl bg-white p-4 sm:p-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </section>
      ) : null}
    </div>
  );
}
