"use client";

import { Search } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  familyOptions,
  formFactorOptions,
  memoryTypeOptions,
  presetOptions,
  resolutionOptions,
  vendorOptions,
  vramOptions,
  type ApiResolution,
  type GpuMatrixQuery,
  type QualityPreset,
} from "@/config/gpu-list";

type GpuListFiltersProps = {
  query: GpuMatrixQuery;
  onChange: (patch: Partial<GpuMatrixQuery>) => void;
};

const ALL = "all";

const yesNoItems = [
  { value: ALL, label: "همه" },
  { value: "true", label: "دارد" },
  { value: "false", label: "ندارد" },
] as const;

const vramSelectItems = [
  { value: ALL, label: "فرقی ندارد" },
  ...vramOptions.map((option) => ({
    value: option.value,
    label: option.label,
  })),
];

function FilterSelect({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: string;
  items: ReadonlyArray<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select
        value={value}
        items={items.map((item) => ({ value: item.value, label: item.label }))}
        onValueChange={(next) => {
          if (next != null) onChange(next);
        }}
      >
        <SelectTrigger className="h-10 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

export function GpuListFilters({ query, onChange }: GpuListFiltersProps) {
  const vendorItems = [
    { value: ALL, label: "همه سازنده‌ها" },
    ...vendorOptions.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  const formFactorItems = formFactorOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const familyItems = [
    { value: ALL, label: "همه سری‌ها" },
    ...familyOptions.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  const memoryItems = [
    { value: ALL, label: "همه انواع" },
    ...memoryTypeOptions.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  const resolutionItems = resolutionOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const presetItems = presetOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
      <Field>
        <FieldLabel htmlFor="gpu-q">جستجو</FieldLabel>
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="gpu-q"
            value={query.q ?? ""}
            placeholder="مثلاً RTX 4070 یا RX 7800..."
            className="h-10 ps-9"
            onChange={(event) =>
              onChange({ q: event.target.value || undefined, page: 1 })
            }
          />
        </div>
      </Field>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          label="سازنده"
          value={query.vendor ?? ALL}
          items={vendorItems}
          onChange={(value) =>
            onChange({
              vendor: value === ALL ? undefined : value,
              page: 1,
            })
          }
        />

        <FilterSelect
          label="نوع سیستم"
          value={query.formFactor ?? "DESKTOP"}
          items={formFactorItems}
          onChange={(value) => onChange({ formFactor: value, page: 1 })}
        />

        <FilterSelect
          label="سری"
          value={query.family ?? ALL}
          items={familyItems}
          onChange={(value) =>
            onChange({
              family: value === ALL ? undefined : value,
              page: 1,
            })
          }
        />

        <FilterSelect
          label="نوع حافظه"
          value={query.memoryType ?? ALL}
          items={memoryItems}
          onChange={(value) =>
            onChange({
              memoryType: value === ALL ? undefined : value,
              page: 1,
            })
          }
        />

        <FilterSelect
          label="حداقل VRAM"
          value={query.vramMin != null ? String(query.vramMin) : ALL}
          items={vramSelectItems}
          onChange={(value) =>
            onChange({
              vramMin: value === ALL ? undefined : Number(value),
              page: 1,
            })
          }
        />

        <FilterSelect
          label="حداکثر VRAM"
          value={query.vramMax != null ? String(query.vramMax) : ALL}
          items={vramSelectItems}
          onChange={(value) =>
            onChange({
              vramMax: value === ALL ? undefined : Number(value),
              page: 1,
            })
          }
        />

        <FilterSelect
          label="Ray Tracing"
          value={
            query.supportsRayTracing == null
              ? ALL
              : query.supportsRayTracing
                ? "true"
                : "false"
          }
          items={yesNoItems}
          onChange={(value) =>
            onChange({
              supportsRayTracing:
                value === ALL ? undefined : value === "true",
              page: 1,
            })
          }
        />

        {query.mode === "fps" ? (
          <>
            <FilterSelect
              label="رزولوشن تخمین"
              value={query.resolution ?? "R1080P"}
              items={resolutionItems}
              onChange={(value) =>
                onChange({
                  resolution: value as ApiResolution,
                  page: 1,
                })
              }
            />
            <FilterSelect
              label="کیفیت تخمین"
              value={query.preset ?? "HIGH"}
              items={presetItems}
              onChange={(value) =>
                onChange({
                  preset: value as QualityPreset,
                  page: 1,
                })
              }
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
