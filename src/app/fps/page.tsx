import type { Metadata } from "next";
import { FpsCalculatorPage } from "@/components/fps/fps-calculator-page";

export const metadata: Metadata = {
  title: "محاسبه FPS",
};

export default function FpsPage() {
  return <FpsCalculatorPage />;
}
