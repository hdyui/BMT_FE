"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BuildingRule } from "@/shared/components/BuildingRule";

const imageRoot = "/images/about/source";

export function AboutHero() {
  const [isReady, setIsReady] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 280);
    return () => window.clearTimeout(timer);
  }, []);

  function handleImageLoad() {
    window.setTimeout(() => setIsImageReady(true), 140);
  }

  return (
    <section className="group relative isolate min-h-[100svh] overflow-hidden bg-white lg:min-h-[784px]">
      <Image
        className={`-z-20 object-cover object-[62%_center] transition-[opacity,scale] delay-100 duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:delay-150 group-hover:duration-700 motion-reduce:opacity-100 motion-reduce:scale-100 max-sm:object-[64%_center] ${
          isImageReady
            ? "scale-100 opacity-100 group-hover:scale-[1.02]"
            : "scale-105 opacity-0"
        }`}
        src={`${imageRoot}/hero-interior.png`}
        alt="Không gian nội thất phòng ăn hiện đại do BMT Decor thiết kế"
        fill
        priority
        sizes="100vw"
        onLoad={handleImageLoad}
      />
      <div
        className="absolute inset-y-0 left-0 -z-10 w-[62vw] max-sm:hidden"
        aria-hidden="true"
      >
        <Image
          className="object-fill"
          src={`${imageRoot}/hero-overlay.svg`}
          alt=""
          fill
          priority
          sizes="62vw"
        />
      </div>
      <div
        className="absolute inset-0 -z-10 hidden max-sm:block max-sm:bg-[linear-gradient(180deg,rgba(255,255,255,.08)_0%,rgba(255,255,255,.18)_34%,rgba(255,255,255,.82)_68%,#fff_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[100svh] w-[min(1380px,calc(100%-2.25rem))] items-center py-16 max-sm:items-end max-sm:pb-[clamp(2.25rem,6svh,4rem)] max-sm:pt-24 lg:min-h-[784px]">
        <div className="w-full max-w-[610px]">
          <p
            className={`text-lg font-medium uppercase tracking-[0.02em] text-charcoal underline decoration-1 underline-offset-8 transition-[opacity,translate] delay-150 duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 max-sm:text-[14px] max-sm:underline-offset-5 sm:text-xl ${
              isReady ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            Về chúng tôi
          </p>
          <h1
            className={`mt-8 max-w-[610px] text-[36px] sm:text-[40px] font-extrabold uppercase leading-[1.06] tracking-[-0.03em] text-brand transition-[opacity,translate] delay-[360ms] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 max-sm:mt-5 max-sm:text-[27px] max-sm:leading-[1.04] max-sm:tracking-[-0.045em] ${
              isReady ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
            }`}
          >
            <span className="max-sm:block">Kiến tạo giá trị từ mỗi</span>{" "}
            <span className="max-sm:block">không gian</span>
          </h1>
          <div
            className={`transition-[opacity,translate] delay-[620ms] duration-800 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 ${
              isReady
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <BuildingRule className="mt-4 h-[30px] w-[325px] max-w-full brightness-0 max-sm:mt-3 max-sm:h-5 max-sm:w-[217px]" />
          </div>
          <p
            className={`mt-5 max-w-[590px] text-justify text-[clamp(10px,2.7vw,11px)] leading-[1.12] text-neutral-800 [text-align-last:left] [text-justify:inter-character] transition-[opacity,translate] delay-[780ms] duration-800 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 max-sm:mt-4 max-sm:text-[14px] max-sm:leading-5 sm:text-base sm:leading-[1.4] lg:leading-[var(--hero-description-desktop-line-height)] ${
              isReady
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <Image
              className="mr-3 inline-block h-6 w-auto align-[-0.28em] brightness-0 saturate-100 [filter:brightness(0)_saturate(100%)_invert(56%)_sepia(88%)_saturate(2340%)_hue-rotate(343deg)_brightness(100%)_contrast(92%)] max-sm:mr-2 max-sm:h-4"
              src="/images/home/building-mark.png"
              alt=""
              width={110}
              height={116}
              sizes="24px"
              aria-hidden="true"
            />
            BMT Decor là đơn vị thiết kế kiến trúc, thiết kế nội thất, thi công
            xây dựng và cải tạo trọn gói, mang đến giải pháp toàn diện cho nhà
            ở, văn phòng và công trình thương mại. Với hơn 15 năm kinh nghiệm
            cùng quy trình triển khai chuyên nghiệp, chúng tôi cam kết kiến tạo
            những không gian hài hòa giữa công năng, thẩm mỹ và chất lượng, tối
            ưu giá trị đầu tư và bền vững theo thời gian.
          </p>
        </div>
      </div>
    </section>
  );
}
