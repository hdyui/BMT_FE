"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";

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
    <section className="group relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-white lg:min-h-[720px]">
      <Image
        className={`-z-20 object-cover object-[62%_center] transition-[opacity,scale] delay-100 duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:delay-150 group-hover:duration-700 motion-reduce:opacity-100 motion-reduce:scale-100 ${
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
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,.98)_34%,rgba(255,255,255,.78)_48%,rgba(255,255,255,.08)_70%)] max-lg:bg-[linear-gradient(90deg,rgba(255,255,255,.98)_0%,rgba(255,255,255,.9)_58%,rgba(255,255,255,.32)_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-[min(1380px,calc(100%-2.25rem))] items-center py-16 lg:min-h-[720px]">
        <div className="w-full max-w-[610px]">
          <p
            className={`text-lg font-medium uppercase tracking-[0.02em] text-charcoal underline decoration-1 underline-offset-8 transition-[opacity,translate] delay-150 duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:text-xl ${
              isReady ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            Về chúng tôi
          </p>
          <h1
            className={`mt-10 max-w-[590px] text-[clamp(2.75rem,5vw,5.15rem)] font-bold uppercase leading-[0.98] tracking-[-0.035em] text-brand transition-[opacity,translate] delay-[360ms] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
              isReady ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
            }`}
          >
            Kiến tạo giá trị từ mỗi không gian
          </h1>
          <div
            className={`transition-[opacity,translate] delay-[620ms] duration-800 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 ${
              isReady
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <BuildingRule className="mt-8 h-8 max-w-[410px] brightness-0" />
          </div>
          <p
            className={`mt-7 max-w-[570px] text-base leading-7 text-neutral-800 transition-[opacity,translate] delay-[780ms] duration-800 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 sm:text-lg sm:leading-8 ${
              isReady
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            BMT Decor là đơn vị thiết kế kiến trúc, thiết kế nội thất, thi công
            xây dựng và cải tạo trọn gói, mang đến giải pháp toàn diện cho nhà ở,
            văn phòng và công trình thương mại. Với hơn 15 năm kinh nghiệm cùng
            quy trình triển khai chuyên nghiệp, chúng tôi cam kết kiến tạo những
            không gian hài hòa giữa công năng, thẩm mỹ và chất lượng, tối ưu giá
            trị đầu tư và bền vững theo thời gian.
          </p>
        </div>
      </div>
    </section>
  );
}
