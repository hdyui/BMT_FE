"use client";

import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";
import { PillCtaButton } from "@/features/services/components/PillCtaButton";

export type SolutionCard = {
  number: string;
  titlePrefix: string;
  titleCategory: string;
  tagline: string;
  description: string;
  checklist: readonly string[];
  cta: string;
  ctaImage: string;
  ctaImageWidth: number;
  ctaImageHeight: number;
  image: string;
};

type SolutionCardsProps = {
  cards: readonly SolutionCard[];
  /** Icon đứng trước mỗi dòng checklist. */
  checkIcon?: string;
  /** Ảnh gạch ngang cam ngắn nằm dưới tagline. */
  ruleImage?: string;
};

export function SolutionCards({
  cards: solutionCards,
  checkIcon = "/images/services/icon-house.png",
  ruleImage,
}: SolutionCardsProps) {
  return (
    <div className="grid gap-5">
      {solutionCards.map((card, index) => {
        const imageFirst = index % 2 === 0;

        return (
          <Reveal
            className="group/card overflow-hidden rounded-[32px] bg-white shadow-[0_4px_20px_rgb(36_33_34/.08)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgb(36_33_34/.16)] lg:h-[560px]"
            delay={index * 160}
            from="fade"
            key={card.number}
          >
            <div
              className={`grid h-full items-stretch lg:grid-cols-[1fr_2fr] ${
                imageFirst ? "" : "lg:[direction:rtl]"
              }`}
            >
              <div className="relative min-h-56 overflow-hidden lg:min-h-full">
                <Image
                  className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                  src={card.image}
                  alt={card.titleCategory}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>

              {/* Khối 1, 3 (imageFirst) trượt từ phải qua trái; khối 2, 4
                  trượt từ trái qua phải, ngay sau khi khối fade in. */}
              <Reveal
                className="flex flex-col justify-center p-7 lg:p-10 lg:[direction:ltr]"
                delay={index * 160 + 120}
                from={imageFirst ? "right" : "left"}
              >
                <div className="flex items-start gap-4">
                  <span className="text-6xl leading-none font-extrabold text-neutral-400 sm:text-[72px]">
                    {card.number}.
                  </span>
                  {/* Tiền tố và nhóm công trình chảy nối tiếp nhau như mockup,
                      chỉ xuống dòng khi hết chỗ. */}
                  <h3 className="mt-1 text-2xl leading-tight font-extrabold uppercase sm:text-[28px]">
                    <span className="text-charcoal">{card.titlePrefix} </span>
                    <br />
                    <span className="text-brand">{card.titleCategory}</span>
                  </h3>
                </div>
                <p className="mt-2 text-sm font-bold">{card.tagline}</p>

                {ruleImage ? (
                  <Image
                    className="mt-3 mb-4 h-[3px] w-[140px] object-fill"
                    src={ruleImage}
                    alt=""
                    width={587}
                    height={13}
                    aria-hidden="true"
                  />
                ) : (
                  <span className="mt-4 mb-4 block h-0.5 w-24 bg-brand" />
                )}

                <p className="text-sm leading-relaxed text-justify">
                  {card.description}
                </p>

                <p className="mt-5 text-sm font-bold">BMT Decor cung cấp:</p>
                <ul className="mt-2 grid gap-1.5">
                  {card.checklist.map((item) => (
                    <li className="flex items-start gap-2 text-sm" key={item}>
                      <Image
                        className="mt-0.5 size-4 shrink-0 object-contain"
                        src={checkIcon}
                        alt=""
                        width={90}
                        height={95}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <PillCtaButton
                  className="mt-6 h-11 max-w-full sm:h-12"
                  href="/du-an"
                  label={card.cta}
                  image={card.ctaImage}
                  imageWidth={card.ctaImageWidth}
                  imageHeight={card.ctaImageHeight}
                />
              </Reveal>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
