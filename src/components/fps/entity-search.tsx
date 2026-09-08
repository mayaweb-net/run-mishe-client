"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { SearchOption } from "@/lib/catalog-search";
import { cn } from "@/lib/utils";

type EntitySearchProps = {
  id?: string;
  label: string;
  placeholder: string;
  icon?: ReactNode;
  value: SearchOption | null;
  onChange: (value: SearchOption | null) => void;
  search: (query: string) => Promise<SearchOption[]>;
  className?: string;
};

export function EntitySearch({
  id,
  label,
  placeholder,
  icon,
  value,
  onChange,
  search,
  className,
}: EntitySearchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SearchOption[]>([]);

  useEffect(() => {
    setQuery(value?.name ?? "");
  }, [value]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const result = await search(query);
        if (!cancelled) setOptions(result);
      } catch {
        if (!cancelled) setOptions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, query, search]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        if (value) setQuery(value.name);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [value]);

  function handleSelect(option: SearchOption) {
    onChange(option);
    setQuery(option.name);
    setOpen(false);
  }

  function handleClear() {
    onChange(null);
    setQuery("");
    setOpen(true);
  }

  return (
    <div ref={containerRef} className={cn("relative space-y-1.5", className)}>
      <label htmlFor={inputId} className="text-sm font-medium leading-none">
        {label}
      </label>

      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute start-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        ) : (
          <Search className="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          id={inputId}
          value={query}
          placeholder={placeholder}
          className={cn("h-10 ps-9", value ? "pe-9" : undefined)}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            setOpen(true);
            if (value && next !== value.name) onChange(null);
          }}
        />
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute end-1 top-1/2 size-7 -translate-y-1/2"
            onClick={handleClear}
            aria-label="پاک کردن"
          >
            <X className="size-3.5" />
          </Button>
        ) : null}
      </div>

      {open ? (
        <div className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border bg-popover p-1 shadow-md">
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-muted-foreground">
              <Spinner />
              در حال جستجو...
            </div>
          ) : options.length ? (
            options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={cn(
                  "flex w-full flex-col rounded-lg px-3 py-2 text-start hover:bg-accent",
                  value?.id === option.id && "bg-accent",
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
              >
                <span className="text-sm font-medium">{option.name}</span>
                {option.subtitle ? (
                  <span className="text-xs text-muted-foreground">
                    {option.subtitle}
                  </span>
                ) : null}
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-muted-foreground">
              موردی پیدا نشد
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
