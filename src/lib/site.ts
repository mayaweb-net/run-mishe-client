export const siteConfig = {
  name: "ران می‌شه",
  shortName: "ران می‌شه",
  description: "پلتفرم ران می‌شه",
  logo: "/img/logo.svg",
  themeColor: "#242424",
  accentColor: "var(--color-secondary-7)",
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:4001";

const DEFAULT_API_BASE_URL = "http://localhost:4002/api";

export function getApiOrigin() {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
  return base.replace(/\/api\/?$/, "");
}

export function decodePathSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function encodePathSegment(segment: string) {
  return encodeURIComponent(decodePathSegment(segment));
}

export function getFileUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  let relative = path.replace(/\\/g, "/").trim().replace(/^\/+/, "");
  if (relative.startsWith("api/files/")) {
    relative = relative.slice("api/files/".length);
  }

  if (!relative) return null;

  const encoded = relative
    .split("/")
    .filter(Boolean)
    .map((segment) => encodePathSegment(segment))
    .join("/");

  return `${getApiOrigin()}/api/files/${encoded}`;
}

