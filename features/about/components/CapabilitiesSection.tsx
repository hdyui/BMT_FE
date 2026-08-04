"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const capabilities: {
  number: string;
  title: string;
  description: string;
  normalImage: string;
  hoverImage: string;
  symbolClass?: string;
  hoverSymbolClass?: string;
  extractWhiteArtwork?: boolean;
  hoverComposite?: boolean;
}[] = [
  {
    number: "01",
    title: "Tổng Thầu Thiết Kế & Thi Công",
    description:
      "Triển khai đồng bộ từ tư vấn, thiết kế, xin phép xây dựng đến thi công và hoàn thiện, đảm bảo sự thống nhất giữa thiết kế và thi công trong toàn bộ dự án.",
    normalImage: "/images/about/source/capability-turnkey.png",
    hoverImage: "/images/about/source/capability-turnkey.png",
    symbolClass: "[clip-path:circle(36%_at_center)]",
    hoverSymbolClass: "scale-100",
    extractWhiteArtwork: true,
    hoverComposite: true,
  },
  {
    number: "02",
    title: "Kiểm Soát Chất Lượng",
    description:
      "Kiểm soát chặt chẽ từ hồ sơ thiết kế, vật liệu, kỹ thuật thi công đến nghiệm thu, đảm bảo mỗi công trình được hoàn thiện đúng tiêu chuẩn và cam kết chất lượng.",
    normalImage: "/images/about/source/capability-quality-symbol.png",
    hoverImage: "/images/about/source/capability-quality-symbol-white.png",
    symbolClass: "scale-[.5]",
  },
  {
    number: "03",
    title: "Triển Khai Đa Loại Hình Công Trình",
    description:
      "Kinh nghiệm thực hiện nhà ở, văn phòng, showroom, nhà hàng, khách sạn và các công trình thương mại với giải pháp phù hợp cho từng quy mô dự án.",
    normalImage: "/images/about/source/capability-target-symbol.png",
    hoverImage: "/images/about/source/capability-target-symbol-white.png",
    symbolClass: "scale-[.64]",
  },
  {
    number: "04",
    title: "Đồng Hành Dài Hạn",
    description:
      "Cam kết bảo hành, bảo trì và hỗ trợ kỹ thuật sau bàn giao, mang đến giá trị sử dụng lâu dài và sự an tâm cho khách hàng.",
    normalImage: "/images/about/source/capability-growth-symbol.png",
    hoverImage: "/images/about/source/capability-growth-symbol-white.png",
    symbolClass: "scale-[.48]",
  },
];

export function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCapability, setHoveredCapability] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.16 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="overflow-hidden bg-white py-24 sm:py-28 lg:py-32" ref={sectionRef}>
      <svg className="absolute size-0" aria-hidden="true">
        <defs>
          <filter id="turnkey-line-orange" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.957
                      0 0 0 0 0.478
                      0 0 0 0 0.165
                      0 1.916 0 0 -0.916"
            />
          </filter>
        </defs>
      </svg>

      <div className="mx-auto w-[min(1380px,calc(100%-2.25rem))]">
        <div className="mx-auto flex flex-col items-center text-center">
          <h2
            className={`whitespace-nowrap text-[clamp(1.9rem,4vw,4rem)] font-bold uppercase leading-none tracking-[-0.025em] text-charcoal transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            Năng lực nổi bật
          </h2>

          <div
            className={`relative mt-5 h-7 w-full max-w-[390px] origin-left transition-[opacity,scale] duration-800 ease-out motion-reduce:scale-x-100 motion-reduce:opacity-100 ${
              isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
            style={{ transitionDelay: "340ms" }}
            aria-hidden="true"
          >
            <Image
              className="object-contain"
              src="/images/home/section-rule.png"
              alt=""
              fill
              sizes="390px"
            />
          </div>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-16 xl:grid-cols-4">
          {capabilities.map(({ number, title, description, normalImage, hoverImage, symbolClass, hoverSymbolClass, extractWhiteArtwork, hoverComposite }, index) => {
            const isHovered = hoveredCapability === index;

            return (
              <article
                className={`relative outline-none transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
                style={{ transitionDelay: `${520 + index * 150}ms` }}
                onMouseEnter={() => setHoveredCapability(index)}
                onMouseLeave={() => setHoveredCapability(null)}
                onFocus={() => setHoveredCapability(index)}
                onBlur={() => setHoveredCapability(null)}
                tabIndex={0}
                key={number}
              >
              <div className="flex items-center gap-4">
                <div
                  className={`relative size-24 shrink-0 overflow-hidden rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:size-28 ${
                    isHovered ? "scale-[1.04]" : "scale-100"
                  }`}
                >
                  <Image
                    className={`object-contain transition-opacity duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                      isHovered ? "opacity-0" : "opacity-100"
                    }`}
                    src="/images/about/source/capability-ring.png"
                    alt=""
                    fill
                    sizes="112px"
                  />

                  <Image
                    className={`object-contain transition-opacity duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${symbolClass ?? ""} ${
                      isHovered ? "opacity-0" : "opacity-100"
                    }`}
                    style={extractWhiteArtwork ? { filter: "url(#turnkey-line-orange)" } : undefined}
                    src={normalImage}
                    alt=""
                    fill
                    sizes="72px"
                  />

                  <div
                    className={`absolute inset-0 overflow-hidden rounded-full transition-opacity duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  >
                    {hoverComposite ? (
                      <Image
                        className={`object-contain ${hoverSymbolClass ?? symbolClass ?? ""}`}
                        src={hoverImage}
                        alt=""
                        fill
                        sizes="112px"
                      />
                    ) : (
                      <>
                        <Image
                          className="object-contain"
                          src="/images/about/source/capability-turnkey.png"
                          alt=""
                          fill
                          sizes="112px"
                        />
                        <span
                          className="absolute inset-[6px] rounded-full"
                          style={{ backgroundColor: "#f47a2a" }}
                        />
                        <Image
                          className={`object-contain ${symbolClass ?? ""}`}
                          src={hoverImage}
                          alt=""
                          fill
                          sizes="72px"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="relative h-24 min-w-0 flex-1 sm:h-28">
                  <span
                    className={`absolute left-6 top-[28px] text-5xl font-bold leading-none transition-colors duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:top-[34px] ${
                      isHovered ? "text-brand" : "text-charcoal"
                    }`}
                  >
                    {number}
                  </span>
                  <div className="absolute bottom-[12px] left-0 right-0 flex items-center" aria-hidden="true">
                    <span className="size-2 shrink-0 rounded-full bg-charcoal" />
                    <span className="h-px flex-1 bg-charcoal" />
                  </div>
                </div>
              </div>

              <div
                className={`transition-[opacity,translate] duration-800 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: `${650 + index * 150}ms` }}
              >
                <h3 className="mt-7 text-[17px] font-bold uppercase leading-tight text-charcoal">
                  {title}
                </h3>
                <p className="mt-3 text-[15px] leading-6 text-neutral-700">
                  {description}
                </p>
              </div>

              {index < capabilities.length - 1 && (
                <ChevronRight
                  className="absolute -right-7 top-24 hidden size-8 stroke-[1.4] text-brand xl:block"
                  aria-hidden="true"
                />
              )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
