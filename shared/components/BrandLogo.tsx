import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

type BrandLogoProps = {
  className?: string;
  inverted?: boolean;
  large?: boolean;
};

export function BrandLogo({
  className,
  inverted = false,
  large = false,
}: BrandLogoProps) {
  const src = large
    ? "/images/home/logo-footer.png"
    : "/images/home/logo-header.png";

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
        alt="BMT Decor"
        width={large ? 856 : 965}
        height={large ? 923 : 168}
        priority={!large}
        sizes={large ? "130px" : "190px"}
      />
    </Link>
  );
}
