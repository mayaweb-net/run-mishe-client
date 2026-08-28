import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { DirectionProvider } from "@/components/ui/direction";
import "@/styles/fonts-iran-yekan.css";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "run-mishe",
  description: "run-mishe client",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DirectionProvider direction="rtl">{children}</DirectionProvider>
      </body>
    </html>
  );
}
