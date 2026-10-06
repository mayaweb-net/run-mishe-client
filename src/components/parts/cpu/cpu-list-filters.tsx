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
  socketOptions,
  vendorOptions,
  type CpuMatrixQuery,
} from "@/config/cpu-list";

type CpuListFiltersProps = {
  query: CpuMatrixQuery;
  onChange: (patch: Partial<CpuMatrixQuery>) => void;
};

const ALL = "all";

const yesNoItems = [
  { value: ALL, label: "همه" },
  { value: "true", label: "بله" },
  { value: "false", label: "خیر" },
] as const;

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

export function CpuListFilters({ query, onChange }: CpuListFiltersProps) {
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

  const socketItems = [
    { value: ALL, label: "همه سوکت‌ها" },
    ...socketOptions.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  const familyItems = [
    { value: ALL, label: "همه سری‌ها" },
    ...familyOptions.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
      <Field>
        <FieldLabel htmlFor="cpu-q">جستجو</FieldLabel>
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="cpu-q"
            value={query.q ?? ""}
            placeholder="مثلاً Ryzen 7 7800X3D یا i7-14700K..."
            className="h-10 ps-9"
            onChange={(event) =>
              onChange({ q: event.target.value || undefined, page: 1 })
            }
          />
        </div>
      </Field>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          label="سوکت"
          value={query.socket ?? ALL}
          items={socketItems}
          onChange={(value) =>
            onChange({
              socket: value === ALL ? undefined : value,
              page: 1,
            })
          }
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
          label="X3D"
          value={
            query.isX3d == null ? ALL : query.isX3d ? "true" : "false"
          }
          items={yesNoItems}
          onChange={(value) =>
            onChange({
              isX3d: value === ALL ? undefined : value === "true",
              page: 1,
            })
          }
        />

        <FilterSelect
          label="Unlocked"
          value={
            query.isUnlocked == null
              ? ALL
              : query.isUnlocked
                ? "true"
                : "false"
          }
          items={yesNoItems}
          onChange={(value) =>
            onChange({
              isUnlocked: value === ALL ? undefined : value === "true",
              page: 1,
            })
          }
        />
      </div>
    </div>
  );
}
