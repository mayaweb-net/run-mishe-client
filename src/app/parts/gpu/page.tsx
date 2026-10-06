import type { Metadata } from "next";
import { Suspense } from "react";
import { GpuListPage } from "@/components/parts/gpu/gpu-list-page";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "کارت‌های گرافیک",
};

function GpuListFallback() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function PartsGpuPage() {
  return (
    <Suspense fallback={<GpuListFallback />}>
      <GpuListPage />
    </Suspense>
  );
}
