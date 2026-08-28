"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyMountProps = {
  /** Nội dung chỉ được render khi phần tử sắp/đang vào viewport. */
  children: ReactNode;
  /**
   * Khoảng cách "mồi trước" quanh viewport để bắt đầu mount sớm một chút,
   * tránh cảm giác giật/pop-in đúng lúc phần tử chạm mép màn hình.
   */
  rootMargin?: string;
  className?: string;
  /** Gán trước chiều cao tối thiểu cho placeholder để đỡ giật layout khi nội dung mount vào. */
  minHeight?: number | string;
};

export function LazyMount({
  children,
  rootMargin = "200px",
  className,
  minHeight,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMounted(true);
        observer.disconnect();
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  if (mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={minHeight ? { minHeight } : undefined}
      aria-hidden="true"
    />
  );
}
