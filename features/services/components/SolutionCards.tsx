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
  mobileMockup?: boolean;
  /** Giữ nội dung và ảnh riêng của trang thiết kế khi dùng layout mobile mockup. */
  mobileContent?: "construction" | "design";
};

const mobileImages = [
  "/images/xay-dung-tron-goi/mobile/solution-house.png",
  "/images/xay-dung-tron-goi/mobile/solution-office-card.png",
  "/images/xay-dung-tron-goi/mobile/solution-showroom-card.png",
  "/images/xay-dung-tron-goi/mobile/solution-hospitality-card.png",
] as const;

const mobileChecklists = [
  [
    "Thiết kế thi công nhà phố, biệt thự",
    "Thiết kế thi công căn hộ",
    "Xây nhà trọn gói",
  ],
  [
    "Thiết kế thi công văn phòng",
    "Thi công văn phòng trọn gói",
    "Thi công khu vực lễ tân, phòng họp và phòng giám đốc",
  ],
  ["Thiết kế showroom, cửa hàng", "Thiết kế spa, thẩm mỹ viện"],
  [
    "Thiết kế nhà hàng, khách sạn, quán café",
    "Thiết kế sảnh, phòng lưu trú và không gian dịch vụ",
  ],
] as const;

const designMobileChecklists = [
  [
    "Thiết kế nội thất nhà phố",
    "Thiết kế nội thất biệt thự",
    "Thiết kế nội thất căn hộ",
  ],
  [
    "Thiết kế văn phòng công ty",
    "Thiết kế văn phòng hiện đại",
    "Thiết kế văn phòng mở",
  ],
  ["Thiết kế showroom, cửa hàng", "Thiết kế spa, thẩm mỹ viện"],
  [
    "Thiết kế nhà hàng, khách sạn, quán café",
    "Thiết kế sảnh, phòng lưu trú và không gian dịch vụ",
  ],
] as const;

export function SolutionCards({
  cards: solutionCards,
  checkIcon = "/images/services/icon-house.png",
  ruleImage,
  mobileMockup = false,
  mobileContent = "construction",
}: SolutionCardsProps) {
  return (
    <div className="grid gap-5">
      {solutionCards.map((card, index) => {
        const imageFirst = index % 2 === 0;

        return (
          <Reveal
            className={`group/card overflow-hidden rounded-[1.5rem] bg-white shadow-[0_4px_20px_rgb(36_33_34/.08)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgb(36_33_34/.16)] lg:min-h-140 lg:rounded-[2rem] ${
              mobileMockup
                ? "max-md:rounded-[1.75rem] max-md:shadow-[0_5px_14px_rgb(36_33_34/.28)]"
                : ""
            }`}
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
                className={`relative min-h-56 overflow-hidden lg:min-h-full ${
                  mobileMockup ? "max-md:min-h-[68vw]" : ""
                }`}
              >
                {mobileMockup && mobileContent === "construction" && (
                  <Image
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover/card:scale-105 md:hidden"
                    src={mobileImages[index]}
                    alt={card.titleCategory}
                    fill
                    sizes="100vw"
                  />
                )}
                <Image
                  className={`object-cover transition-transform duration-500 ease-out group-hover/card:scale-105 ${
                    mobileMockup && mobileContent === "construction"
                      ? "max-md:hidden"
                      : ""
                  }`}
                  src={card.image}
                  alt={card.titleCategory}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>

              {/* Khối 1, 3 (imageFirst) trượt từ phải qua trái; khối 2, 4
                  trượt từ trái qua phải, ngay sau khi khối fade in. */}
              <Reveal
                className={`flex min-w-0 flex-col justify-center p-5 sm:p-7 lg:p-10 lg:[direction:ltr] ${
                  mobileMockup ? "max-md:p-7" : ""
                }`}
                delay={index * 160 + 120}
                from={imageFirst ? "right" : "left"}
              >
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <span className="shrink-0 text-[clamp(2.25rem,11vw,3.5rem)] leading-none font-extrabold text-[#b8babc] sm:text-6xl sm:text-neutral-400 lg:text-[4.5rem]">
                    {card.number}.
                  </span>
                  {/* Tiền tố và nhóm công trình không tự xuống dòng (mỗi dòng
                      luôn 1 hàng như mockup); cỡ chữ co theo bề rộng màn hình
                      để dòng dài nhất vẫn vừa khít, chỉ ngắt dòng ở vị trí <br />. */}
                  <h3 className="font-heading mt-1 min-w-0 text-[clamp(0.8125rem,4vw,1.25rem)] leading-tight font-extrabold whitespace-nowrap uppercase sm:text-2xl lg:text-[1.75rem]">
                    <span className="text-charcoal">{card.titlePrefix} </span>
                    <br />
                    <span className="text-brand md:whitespace-nowrap">
                      {card.titleCategory}
                    </span>
                  </h3>
                </div>
                <p className="mt-2 text-sm font-bold">{card.tagline}</p>

                {ruleImage ? (
                  <Image
                    className="mt-3 mb-4 h-[0.1875rem] w-25 max-w-full object-fill sm:w-35"
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
                {mobileMockup && (
                  <ul className="mt-2 grid gap-1.5 md:hidden">
                    {(mobileContent === "construction"
                      ? mobileChecklists[index]
                      : designMobileChecklists[index]
                    ).map((item) => (
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
                )}
                <ul
                  className={`mt-2 grid gap-1.5 ${
                    mobileMockup ? "max-md:hidden" : ""
                  }`}
                >
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
                  className="mt-6 max-w-full lg:h-12"
                  href="/du-an"
                  label={card.cta}
                  image={card.ctaImage}
                  imageWidth={card.ctaImageWidth}
                  imageHeight={card.ctaImageHeight}
                  mobileImage={card.ctaImageMobile}
                  mobileImageWidth={card.ctaImageMobileWidth}
                  mobileImageHeight={card.ctaImageMobileHeight}
                />
              </Reveal>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
