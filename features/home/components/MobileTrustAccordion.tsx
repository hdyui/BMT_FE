"use client";

import { useState } from "react";
import Image from "next/image";
import { homeTrustReasons as trustReasons } from "@/features/home/data/home-content";
import { TrustCardReveal } from "@/features/home/components/TrustCardReveal";

const mobileTrustImages = [
  {
    normal: "/images/home/mobile-trust-team-normal.png",
    active: "/images/home/mobile-trust-team-active.png",
  },
  {
    normal: "/images/home/mobile-trust-process-normal.png",
    active: "/images/home/mobile-trust-process-active.png",
  },
  {
    normal: "/images/home/mobile-trust-turnkey-normal.png",
    active: "/images/home/mobile-trust-turnkey-active.png",
  },
  {
    normal: "/images/home/mobile-trust-quality-normal.png",
    active: "/images/home/mobile-trust-quality-active.png",
  },
] as const;

function TrustControl() {
  return (
    <span className="relative block size-8 shrink-0" aria-hidden="true">
      <Image
        className="object-contain"
        src="/images/home/mobile-trust-control-circle.png"
        alt=""
        fill
        sizes="32px"
        unoptimized
      />
      <span className="absolute top-1/2 left-1/2 size-[15px] -translate-x-1/2 -translate-y-1/2">
        <Image
          className="object-contain"
          src="/images/home/mobile-trust-control-plus.png"
          alt=""
          fill
          sizes="15px"
          unoptimized
        />
      </span>
    </span>
  );
}

export function MobileTrustAccordion() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="grid gap-4 lg:hidden">
      {trustReasons.map((reason, index) => {
        const isActive = active === index;
        const panelId = `mobile-trust-panel-${index}`;
        const buttonId = `mobile-trust-button-${index}`;
        const images = mobileTrustImages[index];

        return (
          <TrustCardReveal delay={index * 120} key={reason.title}>
            <article className="relative isolate aspect-[3600/3900] overflow-hidden rounded-[28px] bg-charcoal text-white shadow-[0_8px_24px_rgb(36_33_34/.14)]">
              <Image
                className={`object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                  isActive ? "opacity-0" : "opacity-100"
                }`}
                src={images.normal}
                alt=""
                fill
                sizes="calc(100vw - 2rem)"
                quality={75}
              />
              <Image
                className={`object-cover transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
                src={images.active}
                alt={reason.title}
                fill
                sizes="calc(100vw - 2rem)"
                quality={75}
              />
              <Image
                className={`pointer-events-none object-fill transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
                src="/images/home/mobile-trust-active-overlay.png"
                alt=""
                fill
                sizes="calc(100vw - 2rem)"
                unoptimized
              />

              <button
                id={buttonId}
                className="absolute inset-0 z-20 block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                onClick={() =>
                  setActive((current) => (current === index ? null : index))
                }
                aria-controls={panelId}
                aria-expanded={isActive}
                type="button"
              >
                <span
                  className={`absolute inset-x-5 bottom-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                    isActive ? "-translate-y-[72px]" : "translate-y-0"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-[14px] font-extrabold leading-[1.08] tracking-[-0.04em] min-[360px]:text-[15px] min-[360px]:whitespace-nowrap">
                      {reason.title}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold whitespace-nowrap">
                      {isActive ? "Thu gọn" : "Xem thêm"}
                      <TrustControl />
                    </span>
                  </span>
                </span>
              </button>

              <div
                id={panelId}
                className={`absolute inset-x-5 bottom-5 z-10 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none motion-reduce:transition-none ${
                  isActive
                    ? "translate-y-0 opacity-100 delay-150"
                    : "translate-y-3 opacity-0"
                }`}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isActive}
              >
                <p className="pr-2 text-[13px] leading-[1.38] text-white/95">
                  {reason.copy}
                </p>
              </div>
            </article>
          </TrustCardReveal>
        );
      })}
    </div>
  );
}
