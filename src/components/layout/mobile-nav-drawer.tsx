"use client";

import { LogIn, Monitor } from "lucide-react";
import { Logo } from "@/components/main/logo";
import { MobileNavList } from "@/components/layout/mobile-nav-list";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useUIStore } from "@/stores/ui-store";

export function MobileNavDrawer() {
  const { drawerOpen, setDrawerOpen } = useUIStore();

  return (
    <Drawer
      open={drawerOpen}
      onOpenChange={setDrawerOpen}
      swipeDirection="right"
    >
      <DrawerContent className="inset-y-0 right-0! m-0! h-full w-72! max-w-[85vw]! overflow-hidden rounded-s-none! rounded-e-3xl border-0! bg-background p-0 shadow-none ring-0 outline-none after:hidden data-[swipe-direction=right]:right-0! data-[swipe-direction=right]:rounded-s-none! data-[swipe-direction=right]:rounded-e-3xl data-[swipe-direction=right]:border-0! [--bleed:0px] [--drawer-content-height:100dvh] [--drawer-content-width:18rem]! [--drawer-inset:0px]">
        <DrawerTitle className="sr-only">منوی اصلی</DrawerTitle>

        <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4">
          <div className="mb-4 shrink-0">
            <Logo showName size="md" href="" />
          </div>

          <div className="h-px bg-border" />

          <div className="mt-4 flex-1">
            <MobileNavList />
          </div>

          <div className="mt-6 shrink-0 space-y-2 border-t border-border pt-4">
            <Button
              variant="outline"
              className="h-10 w-full rounded-full border-border/80"
            >
              سیستمت چیه؟
              <Monitor className="size-4 text-secondary-7" />
            </Button>
            <Button
              variant="outline"
              className="h-10 w-full rounded-full border-border/80"
            >
              ورود | ثبت‌نام
              <LogIn className="size-4 text-secondary-7" />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
