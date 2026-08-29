import type { Metadata } from "next";
import { RunCheckPage } from "@/components/review/run-check-page";

export const metadata: Metadata = {
  title: "بررسی",
};

export default function ReviewPage() {
  return <RunCheckPage />;
}
