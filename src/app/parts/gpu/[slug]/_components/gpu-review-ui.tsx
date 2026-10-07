import Link from "next/link";
import type {
  GpuGamePerformance,
  GpuScoreCard,
  GpuSpecRow,
} from "@/lib/gpus";
import { PRESET_LABELS, RESOLUTION_LABELS } from "@/lib/gpus";
import { getFileUrl } from "@/lib/site";

export function GpuScoreCards({ cards }: { cards: GpuScoreCard[] }) {
  if (cards.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">امتیازها و بنچمارک‌ها</h2>
        <p className="text-sm text-muted-foreground">
          شاخص‌های داخلی و نتایج تست‌هایی که برای این کارت گرافیک داریم.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li
            key={card.key}
            className="flex flex-col gap-1 rounded-xl border bg-white p-4 sm:p-5"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="text-2xl font-semibold tabular-nums tracking-tight">
              {card.value}
            </p>
            {card.hint ? (
              <p className="text-xs text-muted-foreground">{card.hint}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GpuSpecsTable({ rows }: { rows: GpuSpecRow[] }) {
  if (rows.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">مشخصات فنی</h2>
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b last:border-b-0">
                <th className="w-[40%] bg-muted/40 px-4 py-3 text-start font-medium text-muted-foreground">
                  {row.label}
                </th>
                <td className="px-4 py-3" dir="auto">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const PRESET_ORDER = ["LOW", "MEDIUM", "HIGH", "ULTRA"] as const;

export function GpuGamePerformanceCards({
  items,
}: {
  items: GpuGamePerformance[];
}) {
  const withFps = items.filter((item) =>
    PRESET_ORDER.some((preset) => item.presets[preset] != null),
  );

  if (withFps.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">عملکرد در بازی‌ها</h2>
        <p className="text-sm text-muted-foreground">
          میانگین فریم‌ریت اندازه‌گیری‌شده در بازی‌های منتخب.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {withFps.map((item) => {
          const title = item.game.nameFa?.trim() || item.game.name;
          const cover = getFileUrl(item.game.coverUrl);
          const resolutionLabel = item.resolution
            ? (RESOLUTION_LABELS[item.resolution] ?? item.resolution)
            : null;

          return (
            <li
              key={item.game.id}
              className="overflow-hidden rounded-xl border bg-white"
            >
              <Link
                href={`/games/${item.game.slug}`}
                className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/30"
              >
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt=""
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                    بدون کاور
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <p className="font-medium leading-snug">{title}</p>
                  {resolutionLabel ? (
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      {resolutionLabel}
                    </p>
                  ) : null}
                </div>

                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {PRESET_ORDER.map((preset) => {
                    const fps = item.presets[preset];
                    if (fps == null) return null;
                    return (
                      <div
                        key={preset}
                        className="rounded-lg bg-muted/40 px-2.5 py-2"
                      >
                        <dt className="text-xs text-muted-foreground">
                          {PRESET_LABELS[preset]}
                        </dt>
                        <dd className="font-semibold tabular-nums">
                          {fps.toLocaleString("fa-IR")}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            FPS
                          </span>
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
