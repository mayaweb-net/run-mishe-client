import type { CpuScoreCard, CpuSpecRow } from "@/lib/cpus";

export function CpuScoreCards({ cards }: { cards: CpuScoreCard[] }) {
  if (cards.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">امتیازها و بنچمارک‌ها</h2>
        <p className="text-sm text-muted-foreground">
          شاخص‌های داخلی و نتایج تست‌هایی که برای این پردازنده داریم.
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

export function CpuSpecsTable({ rows }: { rows: CpuSpecRow[] }) {
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
