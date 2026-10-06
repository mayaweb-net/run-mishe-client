import type { Metadata } from "next";
import { Suspense } from "react";
import { CpuListPage } from "@/components/parts/cpu/cpu-list-page";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "پردازنده‌ها",
};

function CpuListFallback() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function PartsCpuPage() {
  return (
    <Suspense fallback={<CpuListFallback />}>
      <CpuListPage />
    </Suspense>
  );
}
