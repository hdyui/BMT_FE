"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function TrustIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <h2
        className={`text-3xl font-bold uppercase transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none sm:text-4xl ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        Vì sao khách hàng tin chọn
      </h2>
      <p
        className={`mx-auto mt-3 max-w-3xl text-xl leading-relaxed text-white/75 transition-[opacity,transform] delay-150 duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        Với tư duy thiết kế luôn đổi mới trong sáng tạo và quy trình thi công
        bài bản, chúng tôi kiến tạo nên những không gian có giá trị thẩm mỹ cao
        cấp, tối ưu công năng và phù hợp với cá tính riêng.
      </p>
      <div className="relative mx-auto mt-4 h-10 w-full max-w-72 overflow-hidden">
        <Image
          className={`origin-left object-contain object-right transition-transform delay-300 duration-700 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
            visible ? "scale-x-100" : "scale-x-0"
          }`}
          src="/images/home/section-rule.png"
          alt=""
          fill
          sizes="288px"
        />
      </div>
    </div>
  );
}
