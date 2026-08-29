"use client";

import Link from "next/link";
import { ChevronDown, LogIn, Menu, Monitor, Search } from "lucide-react";
import { Logo } from "@/components/main/logo";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { mainNavItems, type NavItem } from "@/config/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

function NavLink({ item }: { item: NavItem }) {
  if (item.children?.length) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1 py-1 text-sm font-medium text-foreground transition-colors",
            "hover:text-foreground/80 data-popup-open:text-foreground/80",
          )}
        >
          {item.label}
          <ChevronDown className="size-3.5 opacity-60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          {item.children.map((child) =>
            child.href ? (
              <DropdownMenuItem
                key={child.href}
                render={<Link href={child.href} />}
              >
                {child.label}
              </DropdownMenuItem>
            ) : null,
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      className="rounded-md px-1 py-1 text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
    >
      {item.label}
    </Link>
  );
}

export function SiteHeader() {
  const setDrawerOpen = useUIStore((s) => s.setDrawerOpen);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
          <div className="flex items-center gap-4 py-3 lg:gap-6 lg:py-4">
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="rounded-full md:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="باز کردن منو"
            >
              <Menu />
            </Button>

            <Logo showName size="md" />

            <div className="relative mx-auto hidden min-w-0 flex-1 md:block md:max-w-xl">
              <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`جستجو در ${siteConfig.shortName}`}
                className="h-11 rounded-full border-border/80 bg-background ps-10 text-sm shadow-none"
              />
            </div>

            <div className="ms-auto flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                className="hidden h-10 rounded-full border-border/80 px-4 text-sm font-medium sm:inline-flex"
              >
                سیستمت چیه؟
                <Monitor className="size-4 text-secondary-7" />
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-full border-border/80 px-4 text-sm font-medium"
              >
                <span className="hidden sm:inline">ورود | ثبت‌نام</span>
                <span className="sm:hidden">ورود</span>
                <LogIn className="size-4 text-secondary-7" />
              </Button>
            </div>
          </div>

          <nav className="hidden items-center gap-6 pb-3 md:flex">
            {mainNavItems.map((item) => (
              <NavLink key={item.label} item={item} />
            ))}
          </nav>
        </div>
      </header>

      <MobileNavDrawer />
    </>
  );
}
