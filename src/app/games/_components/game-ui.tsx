import Link from "next/link";
import { getFileUrl } from "@/lib/site";
import {
  requirementSkillLabels,
  requirementTierLabels,
  type PublicGameListItem,
  type PublicGameRequirement,
  type RequirementTier,
} from "@/lib/games";
import { GameGalleryCarousel } from "./game-gallery-carousel";

function preferredName(
  requirement: PublicGameRequirement,
  kind: "CPU" | "GPU",
): string | null {
  const options = requirement.options.filter((option) => option.kind === kind);
  const linked = options.find(
    (option) => (kind === "CPU" ? option.cpu : option.gpu) && !option.needsReview,
  );
  const any = linked ?? options[0];
  if (!any) {
    return kind === "CPU" ? requirement.rawCpuText : requirement.rawGpuText;
  }
  return (
    (kind === "CPU" ? any.cpu?.name : any.gpu?.name) ??
    any.matchedText ??
    (kind === "CPU" ? requirement.rawCpuText : requirement.rawGpuText)
  );
}

export function GameCardGrid({ items }: { items: PublicGameListItem[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((game) => {
        const cover = getFileUrl(game.coverUrl);
        const title = game.nameFa?.trim() || game.name;
        return (
          <li key={game.id}>
            <Link
              href={`/games/${game.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-background transition hover:border-primary/40"
            >
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover}
                  alt=""
                  className="aspect-[16/9] w-full object-cover transition group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center bg-muted text-sm text-muted-foreground">
                  بدون کاور
                </div>
              )}
              <div className="flex flex-1 flex-col gap-1 p-4">
                <h2 className="line-clamp-2 text-base font-semibold leading-snug">
                  {title}
                </h2>
                {game.nameFa && game.nameFa !== game.name ? (
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {game.name}
                  </p>
                ) : null}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function GameRequirementCard({
  requirement,
  emphasize,
}: {
  requirement: PublicGameRequirement;
  emphasize?: boolean;
}) {
  const cpu = preferredName(requirement, "CPU");
  const gpu = preferredName(requirement, "GPU");
  const tier = requirement.tier as RequirementTier;

  return (
    <article
      className={
        emphasize
          ? "flex flex-col gap-3 rounded-xl border border-primary/30 bg-white p-4 sm:p-5"
          : "flex flex-col gap-3 rounded-xl border bg-white p-4 sm:p-5"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">
            {requirementTierLabels[tier]}
          </h3>
          <p className="text-sm text-muted-foreground">
            {requirementSkillLabels[tier]}
          </p>
        </div>
      </div>

      <dl className="grid gap-2 text-sm">
        {cpu ? (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">پردازنده</dt>
            <dd className="text-left font-medium" dir="ltr">
              {cpu}
            </dd>
          </div>
        ) : null}
        {gpu ? (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">کارت گرافیک</dt>
            <dd className="text-left font-medium" dir="ltr">
              {gpu}
            </dd>
          </div>
        ) : null}
        {requirement.ramGb != null ? (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">رم</dt>
            <dd className="font-medium">{requirement.ramGb} GB</dd>
          </div>
        ) : null}
        {requirement.vramGb != null ? (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">VRAM</dt>
            <dd className="font-medium">{requirement.vramGb} GB</dd>
          </div>
        ) : null}
        {requirement.storageGb != null ? (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">فضا</dt>
            <dd className="font-medium">
              {requirement.storageGb} GB
              {requirement.needsSsd ? " (SSD)" : ""}
            </dd>
          </div>
        ) : null}
        {requirement.os ? (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">سیستم‌عامل</dt>
            <dd className="text-left font-medium" dir="ltr">
              {requirement.os}
            </dd>
          </div>
        ) : null}
      </dl>

      {requirement.notes ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {requirement.notes}
        </p>
      ) : null}
    </article>
  );
}

export function GameSkillReviewCards({
  requirements,
  gameSlug,
}: {
  requirements: PublicGameRequirement[];
  gameSlug: string;
}) {
  const preferredTiers = (["HIGH", "ULTRA"] as const)
    .map((tier) => requirements.find((item) => item.tier === tier))
    .filter((item): item is PublicGameRequirement => Boolean(item));

  const fallbackTiers = (["MINIMUM", "RECOMMENDED"] as const)
    .map((tier) => requirements.find((item) => item.tier === tier))
    .filter((item): item is PublicGameRequirement => Boolean(item));

  const cards = preferredTiers.length > 0 ? preferredTiers : fallbackTiers;
  if (cards.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">بررسی روی کارت‌های منتخب</h2>
        <p className="text-sm text-muted-foreground">
          هر سطح سخت‌افزار، سطح اجرای متفاوتی از این بازی را نشان می‌دهد.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {cards.map((requirement) => {
          const cpu = preferredName(requirement, "CPU");
          const gpu = preferredName(requirement, "GPU");
          const tier = requirement.tier as RequirementTier;
          return (
            <li
              key={requirement.tier}
              className="flex h-full flex-col gap-3 rounded-xl border bg-white p-4 sm:p-5"
            >
              <div>
                <p className="text-xs font-medium text-primary">
                  {requirementSkillLabels[tier]}
                </p>
                <h3 className="text-base font-semibold">
                  {requirementTierLabels[tier]}
                </h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {cpu ? (
                  <li>
                    CPU:{" "}
                    <span className="font-medium text-foreground" dir="ltr">
                      {cpu}
                    </span>
                  </li>
                ) : null}
                {gpu ? (
                  <li>
                    GPU:{" "}
                    <span className="font-medium text-foreground" dir="ltr">
                      {gpu}
                    </span>
                  </li>
                ) : null}
              </ul>
              <Link
                href={`/review?game=${encodeURIComponent(gameSlug)}`}
                className="mt-auto text-sm font-medium text-primary hover:underline"
              >
                بررسی سیستم خودتان
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function GameGallery({ paths }: { paths: string[] }) {
  const urls = paths
    .map((path) => getFileUrl(path))
    .filter((url): url is string => Boolean(url));

  return <GameGalleryCarousel urls={urls} />;
}
