import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { DirectionProvider } from "@/components/ui/direction";
import { siteConfig } from "@/lib/site";
import "@/styles/fonts-iran-yekan.css";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: {
    icon: [
      { url: "/logo/favicon.ico" },
      { url: "/logo/favicon.svg", type: "image/svg+xml" },
      {
        url: "/logo/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
    apple: "/logo/apple-touch-icon.png",
  },
  manifest: "/logo/site.webmanifest",
  appleWebApp: {
    title: siteConfig.shortName,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  themeColor: siteConfig.themeColor,
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
