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
    <section className="group relative isolate min-h-[100svh] overflow-hidden bg-white lg:min-h-[784px]">
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
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,.82)_0%,rgba(255,255,255,.72)_28%,rgba(255,255,255,.52)_45%,rgba(255,255,255,.24)_56%,rgba(255,255,255,.06)_65%,rgba(255,255,255,0)_72%)] max-lg:bg-[linear-gradient(90deg,rgba(255,255,255,.88)_0%,rgba(255,255,255,.76)_42%,rgba(255,255,255,.48)_68%,rgba(255,255,255,.18)_88%,rgba(255,255,255,.08)_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[100svh] w-[min(1380px,calc(100%-2.25rem))] items-center py-16 lg:min-h-[784px]">
        <div className="w-full max-w-[610px]">
          <p
            className={`text-lg font-medium uppercase tracking-[0.02em] text-charcoal underline decoration-1 underline-offset-8 transition-[opacity,translate] delay-150 duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:text-xl ${
              isReady ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            Về chúng tôi
          </p>
          <h1
            className={`mt-8 max-w-[610px] text-[36px] sm:text-[40px] font-extrabold uppercase leading-[1.06] tracking-[-0.03em] text-brand transition-[opacity,translate] delay-[360ms] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
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
            <BuildingRule className="mt-6 h-[30px] w-[325px] max-w-full brightness-0" />
          </div>
          <p
            className={`mt-7 max-w-[590px] text-justify text-lg leading-7 text-neutral-800 [text-align-last:left] [text-justify:inter-character] transition-[opacity,translate] delay-[780ms] duration-800 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 sm:text-xl sm:leading-8 ${
              isReady
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <Image
              className="mr-3 inline-block h-6 w-auto align-[-0.28em] brightness-0 saturate-100 [filter:brightness(0)_saturate(100%)_invert(56%)_sepia(88%)_saturate(2340%)_hue-rotate(343deg)_brightness(100%)_contrast(92%)]"
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
