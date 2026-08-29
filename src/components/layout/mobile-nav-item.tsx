"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  isGroupActive,
  isPathActive,
  navKey,
  type NavItem,
} from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

const navBase =
  "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm font-medium transition-colors";

const navIdle =
  "border-transparent text-foreground/75 hover:bg-muted hover:text-foreground";

const navActive =
  "border-secondary-6/40 bg-secondary-2 text-secondary-9";

interface MobileNavItemProps {
  item: NavItem;
  depth?: number;
}

export function MobileNavItem({ item, depth = 0 }: MobileNavItemProps) {
  const pathname = usePathname();
  const setDrawerOpen = useUIStore((s) => s.setDrawerOpen);
  const children = item.children ?? [];
  const hasChildren = children.length > 0;
  const groupActive = isGroupActive(pathname, item);
  const leafActive = item.href ? isPathActive(pathname, item.href) : false;
  const [open, setOpen] = useState(groupActive);
  const Icon = item.icon;

  useEffect(() => {
    if (groupActive) setOpen(true);
  }, [groupActive]);

  if (hasChildren) {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "w-full",
            navBase,
            groupActive ? navActive : navIdle,
          )}
        >
          {Icon ? <Icon className="size-4 shrink-0" /> : null}
          <span className="min-w-0 flex-1 truncate text-start">{item.label}</span>
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 opacity-70 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open ? (
          <div className="ms-3 flex flex-col gap-1 border-s border-border ps-2">
            {children.map((child) => (
              <MobileNavItem key={navKey(child)} item={child} depth={depth + 1} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      onClick={() => setDrawerOpen(false)}
      className={cn(
        navBase,
        depth > 0 && "py-1.5 text-[13px]",
        leafActive ? navActive : navIdle,
      )}
    >
      {Icon && depth === 0 ? <Icon className="size-4 shrink-0" /> : null}
      <span className="truncate">{item.label}</span>
    </Link>
  );
}
