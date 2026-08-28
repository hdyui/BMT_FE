import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./BmtCta.module.css";

type BmtCtaProps = {
  children: ReactNode;
  href: string;
  variant?: "hero" | "compact";
  className?: string;
};

export function BmtCta({
  children,
  href,
  variant = "hero",
  className,
}: BmtCtaProps) {
  return (
    <Link className={cn(styles.cta, styles[variant], className)} href={href}>
      <span className={styles.label}>{children}</span>
    </Link>
  );
}
