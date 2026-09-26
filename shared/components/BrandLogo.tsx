import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

type BrandLogoProps = {
  src: string;
  alt?: string | null;
  className?: string;
  inverted?: boolean;
  large?: boolean;
};

export function BrandLogo({
  src,
  alt,
  className,
  inverted = false,
  large = false,
}: BrandLogoProps) {
  return (
    <Link
      className={cn("relative block shrink-0", className)}
      href="/"
      aria-label="BMT Decor - Trang chủ"
    >
      <Image
        className={cn(
          "object-contain",
          inverted && !large ? "brightness-100" : "",
        )}
        src={src}
        alt={alt ?? ""}
        width={large ? 856 : 965}
        height={large ? 923 : 168}
        priority={!large}
        sizes={large ? "130px" : "190px"}
      />
    </Link>
  );
}
