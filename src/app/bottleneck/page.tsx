import type { Metadata } from "next";
import { BottleneckPage } from "@/components/bottleneck/bottleneck-page";

export const metadata: Metadata = {
  title: "گلوگاه سیستم",
};

export default function BottleneckRoutePage() {
  return <BottleneckPage />;
}
