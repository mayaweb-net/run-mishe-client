import { mainNavItems, navKey } from "@/config/navigation";
import { MobileNavItem } from "@/components/layout/mobile-nav-item";

export function MobileNavList() {
  return (
    <nav className="flex flex-col gap-1.5">
      {mainNavItems.map((item) => (
        <MobileNavItem key={navKey(item)} item={item} />
      ))}
    </nav>
  );
}
