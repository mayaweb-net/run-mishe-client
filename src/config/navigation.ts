import {
  Cpu,
  Gamepad2,
  Gauge,
  Info,
  type LucideIcon,
  Newspaper,
} from "lucide-react";

export type NavItem = {
  label: string;
  href?: string;
  icon?: LucideIcon;
  children?: NavItem[];
};

export const mainNavItems: NavItem[] = [
  {
    label: "ران می‌شه",
    icon: Info,
    children: [
      { label: "بررسی", href: "/review" },
      { label: "محاسبه FPS", href: "/fps" },
    ],
  },
  {
    label: "قطعات",
    icon: Cpu,
    children: [
      { label: "پردازنده", href: "/parts/cpu" },
      { label: "کارت گرافیک", href: "/parts/gpu" },
      { label: "رم", href: "/parts/ram" },
    ],
  },
  {
    label: "بنچمارک",
    icon: Gauge,
    children: [
      { label: "CPU", href: "/benchmark/cpu" },
      { label: "GPU", href: "/benchmark/gpu" },
    ],
  },
  {
    label: "بازی‌ها",
    href: "/games",
    icon: Gamepad2,
  },
  {
    label: "بلاگ",
    href: "/blog",
    icon: Newspaper,
  },
];

export function navKey(item: NavItem) {
  return item.href ?? item.label;
}

export function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isGroupActive(pathname: string, item: NavItem): boolean {
  if (item.children?.length) {
    return item.children.some((child) => isGroupActive(pathname, child));
  }
  if (!item.href) return false;
  return isPathActive(pathname, item.href);
}
