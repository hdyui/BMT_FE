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
  ctaImageMobile?: string;
  ctaImageMobileWidth?: number;
  ctaImageMobileHeight?: number;
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
    <div className="grid gap-4 md:gap-5">
      {solutionCards.map((card, index) => {
        const imageFirst = index % 2 === 0;

        return (
          <Reveal
            className="group/card overflow-hidden rounded-[clamp(1.4rem,6vw,2rem)] bg-white shadow-[0_2px_6px_rgb(36_33_34/.55)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_8px_16px_rgb(36_33_34/.5)] active:-translate-y-1 active:shadow-[0_6px_12px_rgb(36_33_34/.52)] md:rounded-[1.5rem] md:shadow-[0_3px_8px_rgb(36_33_34/.5)] lg:min-h-140 lg:rounded-[2rem]"
            delay={index * 160}
            from="fade"
            key={card.number}
          >
            <div
              className={`grid h-full items-stretch lg:grid-cols-[1fr_2fr] ${
                imageFirst ? "" : "lg:[direction:rtl]"
              }`}
            >
              <div
                className="relative aspect-[1.255] w-full overflow-hidden md:aspect-auto md:min-h-56 lg:min-h-full"
              >
                <Image
                  className="object-cover object-top md:object-center transition-transform duration-500 ease-out group-hover/card:scale-105 group-active/card:scale-105"
                  src={card.image}
                  alt={card.titleCategory}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>

              {/* Khối 1, 3 (imageFirst) trượt từ phải qua trái; khối 2, 4
                  trượt từ trái qua phải, ngay sau khi khối fade in. */}
              <Reveal
                className="flex min-w-0 flex-col justify-center px-[7.5%] pt-[5%] pb-[6%] md:p-7 lg:p-10 lg:[direction:ltr]"
                delay={index * 160 + 120}
                from={imageFirst ? "right" : "left"}
              >
                <div className="flex min-w-0 items-start gap-[4%] md:gap-4">
                  <span className="shrink-0 text-[clamp(2.95rem,13vw,4.35rem)] leading-[0.9] font-extrabold text-[#b8babc] md:text-6xl md:leading-none md:text-neutral-400 lg:text-[4.5rem]">
                    {card.number}.
                  </span>
                  {/* Tiền tố và nhóm công trình không tự xuống dòng (mỗi dòng
                      luôn 1 hàng như mockup); cỡ chữ co theo bề rộng màn hình
                      để dòng dài nhất vẫn vừa khít, chỉ ngắt dòng ở vị trí <br />. */}
                  <h3 className="font-heading min-w-0 pt-[1%] text-[clamp(0.875rem,4.15vw,1.45rem)] leading-[1.3] font-extrabold uppercase md:mt-1 md:pt-0 md:text-2xl md:leading-tight md:whitespace-nowrap lg:text-[1.75rem]">
                    <span className="text-charcoal">{card.titlePrefix} </span>
                    <br />
                    <span className="text-brand whitespace-nowrap">
                      {card.titleCategory}
                    </span>
                  </h3>
                </div>
                <p className="mt-2 text-[clamp(0.72rem,3vw,0.88rem)] leading-tight font-extrabold md:text-sm">
                  {card.tagline}
                </p>

                {ruleImage ? (
                  <Image
                    className="mt-2.5 mb-3 h-0.5 w-[26%] max-w-full object-fill md:mt-3 md:mb-4 md:h-[0.1875rem] md:w-35"
                    src={ruleImage}
                    alt=""
                    width={587}
                    height={13}
                    aria-hidden="true"
                  />
                ) : (
                  <span className="mt-2.5 mb-3 block h-0.5 w-[26%] bg-brand md:mt-4 md:mb-4 md:w-24" />
                )}

                <p className="text-justify text-[clamp(0.69rem,2.72vw,0.82rem)] leading-[1.22] md:text-sm md:leading-relaxed">
                  {card.description}
                </p>

                <p className="mt-2 text-[clamp(0.7rem,2.85vw,0.84rem)] font-extrabold md:mt-5 md:text-sm">
                  BMT Decor cung cấp:
                </p>
                <ul className="mt-1 grid gap-0.5 md:mt-2 md:gap-1.5">
                  {card.checklist.map((item) => (
                    <li
                      className="flex items-start gap-2 text-[clamp(0.69rem,2.72vw,0.82rem)] leading-[1.2] md:text-sm"
                      key={item}
                    >
                      <Image
                        className="mt-px size-[clamp(0.7rem,3vw,0.9rem)] shrink-0 object-contain md:mt-0.5 md:size-4"
                        src={checkIcon}
                        alt=""
                        width={90}
                        height={95}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 h-[clamp(1.6rem,6.5vw,2.05rem)] md:hidden">
                  <PillCtaButton
                    className="h-full max-w-full"
                    href="/du-an"
                    label={card.cta}
                    image={card.ctaImageMobile ?? card.ctaImage}
                    imageWidth={card.ctaImageMobileWidth ?? card.ctaImageWidth}
                    imageHeight={card.ctaImageMobileHeight ?? card.ctaImageHeight}
                    textClassName="!text-[clamp(0.67rem,2.65vw,0.8rem)]"
                    textPaddingRightPercent={10}
                  />
                </div>
                <div className="mt-6 hidden md:block">
                  <PillCtaButton
                    className="max-w-full lg:h-12"
                    href="/du-an"
                    label={card.cta}
                    image={card.ctaImage}
                    imageWidth={card.ctaImageWidth}
                    imageHeight={card.ctaImageHeight}
                  />
                </div>
              </Reveal>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
