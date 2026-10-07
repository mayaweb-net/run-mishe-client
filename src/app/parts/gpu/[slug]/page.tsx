import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  applyGpuContentPlaceholders,
  buildGeneratedGpuSummary,
  buildGpuScoreCards,
  buildGpuSpecRows,
  fetchGpuBySlug,
} from "@/lib/gpus";
import {
  sanitizeArticleHtml,
  stripHtml,
  truncateText,
} from "@/lib/sanitize-article-html";
import { SITE_URL, getFileUrl } from "@/lib/site";
import {
  GpuGamePerformanceCards,
  GpuScoreCards,
  GpuSpecsTable,
} from "./_components/gpu-review-ui";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const gpu = await fetchGpuBySlug(slug);
    const description =
      gpu.description?.trim() ||
      truncateText(stripHtml(gpu.content ?? "")) ||
      buildGeneratedGpuSummary(gpu);
    const cover = getFileUrl(gpu.coverUrl);
    const canonical = `${SITE_URL}/parts/gpu/${gpu.slug}`;

    return {
      title: `بررسی ${gpu.name}`,
      description,
      alternates: { canonical },
      openGraph: {
        title: gpu.name,
        description,
        type: "website",
        url: canonical,
        ...(cover ? { images: [{ url: cover }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: gpu.name,
        description,
        ...(cover ? { images: [cover] } : {}),
      },
    };
  } catch {
    return {
      title: "کارت گرافیک یافت نشد",
      robots: { index: false, follow: false },
    };
  }
}

export default async function GpuReviewPage({ params }: PageProps) {
  const { slug } = await params;

  let gpu: Awaited<ReturnType<typeof fetchGpuBySlug>>;
  try {
    gpu = await fetchGpuBySlug(slug);
  } catch {
    notFound();
  }

  const shortDescription =
    gpu.description?.trim() || buildGeneratedGpuSummary(gpu);

  const rawContent = gpu.content?.trim()
    ? applyGpuContentPlaceholders(gpu.content, gpu)
    : `<p>${buildGeneratedGpuSummary(gpu)}</p>`;
  const html = sanitizeArticleHtml(rawContent);

  const scoreCards = buildGpuScoreCards(gpu);
  const specRows = buildGpuSpecRows(gpu);
  const cover = getFileUrl(gpu.coverUrl);
  const releaseLabel = gpu.releaseDate
    ? new Date(gpu.releaseDate).toLocaleDateString("fa-IR")
    : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8">
      <div>
        <Link
          href="/parts/gpu"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          بازگشت به کارت‌های گرافیک
        </Link>
      </div>

      <header className="grid gap-6 rounded-xl border bg-white p-5 sm:p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              {gpu.name}
            </h1>
            <p className="text-sm text-muted-foreground" dir="ltr">
              {gpu.slug}
            </p>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground">
            {shortDescription}
          </p>

          <dl className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div>
              <dt className="inline">سازنده: </dt>
              <dd className="inline font-medium text-foreground">{gpu.vendor}</dd>
            </div>
            {gpu.family ? (
              <div>
                <dt className="inline">خانواده: </dt>
                <dd className="inline font-medium text-foreground">
                  {gpu.family}
                </dd>
              </div>
            ) : null}
            {gpu.vramGb != null ? (
              <div>
                <dt className="inline">VRAM: </dt>
                <dd className="inline font-medium text-foreground">
                  {gpu.vramGb.toLocaleString("fa-IR")} GB
                  {gpu.memoryType ? ` ${gpu.memoryType}` : ""}
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
            {gpu.gamingIndex != null ? (
              <div>
                <dt className="inline">شاخص گیمینگ: </dt>
                <dd className="inline font-medium text-foreground">
                  {Math.round(gpu.gamingIndex).toLocaleString("fa-IR")}
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

      <GpuScoreCards cards={scoreCards} />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">توضیحات کامل</h2>
        <div
          className="article-html-content rounded-xl bg-white p-4 sm:p-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>

      <GpuSpecsTable rows={specRows} />

      <GpuGamePerformanceCards items={gpu.gamePerformance ?? []} />
    </div>
  );
}
