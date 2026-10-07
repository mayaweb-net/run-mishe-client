import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  applyCpuContentPlaceholders,
  buildCpuScoreCards,
  buildCpuSpecRows,
  buildGeneratedCpuSummary,
  fetchCpuBySlug,
} from "@/lib/cpus";
import {
  sanitizeArticleHtml,
  stripHtml,
  truncateText,
} from "@/lib/sanitize-article-html";
import { SITE_URL, getFileUrl } from "@/lib/site";
import { CpuScoreCards, CpuSpecsTable } from "./_components/cpu-review-ui";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const cpu = await fetchCpuBySlug(slug);
    const description =
      cpu.description?.trim() ||
      truncateText(stripHtml(cpu.content ?? "")) ||
      buildGeneratedCpuSummary(cpu);
    const cover = getFileUrl(cpu.coverUrl);
    const canonical = `${SITE_URL}/parts/cpu/${cpu.slug}`;

    return {
      title: `بررسی ${cpu.name}`,
      description,
      alternates: { canonical },
      openGraph: {
        title: cpu.name,
        description,
        type: "website",
        url: canonical,
        ...(cover ? { images: [{ url: cover }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: cpu.name,
        description,
        ...(cover ? { images: [cover] } : {}),
      },
    };
  } catch {
    return {
      title: "پردازنده یافت نشد",
      robots: { index: false, follow: false },
    };
  }
}

export default async function CpuReviewPage({ params }: PageProps) {
  const { slug } = await params;

  let cpu: Awaited<ReturnType<typeof fetchCpuBySlug>>;
  try {
    cpu = await fetchCpuBySlug(slug);
  } catch {
    notFound();
  }

  const shortDescription =
    cpu.description?.trim() || buildGeneratedCpuSummary(cpu);

  const rawContent = cpu.content?.trim()
    ? applyCpuContentPlaceholders(cpu.content, cpu)
    : `<p>${buildGeneratedCpuSummary(cpu)}</p>`;
  const html = sanitizeArticleHtml(rawContent);

  const scoreCards = buildCpuScoreCards(cpu);
  const specRows = buildCpuSpecRows(cpu);
  const cover = getFileUrl(cpu.coverUrl);
  const releaseLabel = cpu.releaseDate
    ? new Date(cpu.releaseDate).toLocaleDateString("fa-IR")
    : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8">
      <div>
        <Link
          href="/parts/cpu"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          بازگشت به پردازنده‌ها
        </Link>
      </div>

      <header className="grid gap-6 rounded-xl border bg-white p-5 sm:p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              {cpu.name}
            </h1>
            <p className="text-sm text-muted-foreground" dir="ltr">
              {cpu.slug}
            </p>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground">
            {shortDescription}
          </p>

          <dl className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div>
              <dt className="inline">سازنده: </dt>
              <dd className="inline font-medium text-foreground">{cpu.vendor}</dd>
            </div>
            {cpu.family ? (
              <div>
                <dt className="inline">خانواده: </dt>
                <dd className="inline font-medium text-foreground">
                  {cpu.family}
                </dd>
              </div>
            ) : null}
            {cpu.socket ? (
              <div>
                <dt className="inline">سوکت: </dt>
                <dd className="inline font-medium text-foreground" dir="ltr">
                  {cpu.socket}
                </dd>
              </div>
            ) : null}
            {releaseLabel ? (
              <div>
                <dt className="inline">عرضه: </dt>
                <dd className="inline font-medium text-foreground">
                  {releaseLabel}
                </dd>
              </div>
            ) : null}
            {cpu.gamingIndex != null ? (
              <div>
                <dt className="inline">شاخص گیمینگ: </dt>
                <dd className="inline font-medium text-foreground">
                  {Math.round(cpu.gamingIndex).toLocaleString("fa-IR")}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="aspect-[16/10] w-full rounded-xl border object-cover"
          />
        ) : null}
      </header>

      <CpuScoreCards cards={scoreCards} />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">توضیحات کامل</h2>
        <div
          className="article-html-content rounded-xl bg-white p-4 sm:p-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>

      <CpuSpecsTable rows={specRows} />
    </div>
  );
}
