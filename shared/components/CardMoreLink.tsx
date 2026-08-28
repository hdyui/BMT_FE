import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CardMoreLinkProps = {
  href: string;
  label?: string;
  className?: string;
};

export function CardMoreLink({
  href,
  label = "Xem thêm",
  className,
}: CardMoreLinkProps) {
  return (
    <Link
      className={cn(
        "group/card-more inline-flex w-fit items-center gap-3 text-sm font-semibold text-white underline decoration-1 underline-offset-4 transition-colors duration-300 hover:text-brand focus-visible:text-brand",
        className,
      )}
      href={href}
    >
      {label}
      <span className="grid size-7 place-items-center rounded-full border border-current no-underline transition-colors duration-300">
        <ArrowUpRight className="size-4" />
      </span>
    </Link>
  );
}
