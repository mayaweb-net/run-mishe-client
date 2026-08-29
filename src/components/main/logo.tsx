import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
} as const;

type LogoProps = {
  className?: string;
  showName?: boolean;
  size?: keyof typeof sizeClasses;
  href?: string;
};

export function Logo({
  className,
  showName = false,
  size = "md",
  href = "/",
}: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img
        src={siteConfig.logo}
        alt={siteConfig.name}
        width={57}
        height={57}
        className={cn(sizeClasses[size], "shrink-0 rounded-lg")}
      />
      {showName ? (
        <span className="text-lg font-bold tracking-tight text-foreground">
          {siteConfig.shortName}
        </span>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="shrink-0 transition-opacity hover:opacity-80">
        {content}
      </Link>
    );
  }

  return content;
}
