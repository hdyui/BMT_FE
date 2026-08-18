"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { ProjectDetail } from "../data/project-details";
import styles from "./ProjectDetail.module.css";

type Comparison = ProjectDetail["comparisons"][number];

export function BeforeAfterSlider({ comparison }: { comparison: Comparison }) {
  const [position, setPosition] = useState(50);
  const sliderId = useId();
  const { before, after } = comparison;

  return (
    <figure className={styles.beforeAfterFigure}>
      <div className={`${styles.comparisonMedia} ${styles.beforeAfterMedia}`}>
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes="(min-width: 1200px) 1100px, calc(100vw - 2.25rem)"
          className={styles.comparisonImage}
          draggable={false}
        />

        <div
          className={styles.beforeAfterBefore}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          aria-hidden="true"
        >
          <Image
            src={before.src}
            alt=""
            fill
            sizes="(min-width: 1200px) 1100px, calc(100vw - 2.25rem)"
            className={styles.comparisonImage}
            draggable={false}
          />
        </div>

        <span className={`${styles.beforeAfterBadge} ${styles.beforeAfterBadgeBefore}`}>
          <Image
            src="/images/projects/detail/before-after-badge.png"
            alt=""
            fill
            sizes="160px"
            className={styles.beforeAfterBadgeImage}
            aria-hidden="true"
          />
          <span className={styles.beforeAfterBadgeText}>{before.badge ?? "Trước"}</span>
        </span>
        <span className={`${styles.beforeAfterBadge} ${styles.beforeAfterBadgeAfter}`}>
          <Image
            src="/images/projects/detail/before-after-badge.png"
            alt=""
            fill
            sizes="160px"
            className={styles.beforeAfterBadgeImage}
            aria-hidden="true"
          />
          <span className={styles.beforeAfterBadgeText}>{after.badge ?? "Sau"}</span>
        </span>

        <span
          className={styles.beforeAfterDivider}
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <span className={styles.beforeAfterHandle}>
            <span>←</span>
            <span>→</span>
          </span>
        </span>

        <input
          id={sliderId}
          className={styles.beforeAfterRange}
          type="range"
          min="0"
          max="100"
          step="1"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={`So sánh ${before.label} và ${after.label}`}
          aria-valuetext={`${position}% ảnh ${before.label}`}
        />
      </div>
      <figcaption className="sr-only">
        Kéo thanh so sánh để xem {before.label.toLowerCase()} và {after.label.toLowerCase()}.
      </figcaption>
    </figure>
  );
}
