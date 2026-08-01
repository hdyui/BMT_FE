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
};

export function SolutionCards({ cards: solutionCards }: SolutionCardsProps) {
  return (
    <div className="grid gap-5">
      {solutionCards.map((card, index) => {
        const imageFirst = index % 2 === 0;

        return (
          <Reveal
            className="group/card overflow-hidden rounded-[32px] bg-white shadow-[0_4px_20px_rgb(36_33_34/.08)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgb(36_33_34/.16)]"
            delay={80}
            key={card.number}
          >
            <div
              className={`grid items-stretch lg:grid-cols-[1fr_2fr] ${
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

              <Reveal
                className="flex flex-col justify-center p-7 lg:p-10 lg:[direction:ltr]"
                from={imageFirst ? "right" : "left"}
              >
                <div className="flex items-start gap-3">
                  <span className="text-6xl leading-none font-bold text-neutral-300 sm:text-7xl">
                    {card.number}.
                  </span>
                  <h3 className="mt-1 text-2xl leading-tight uppercase sm:text-3xl">
                    <span className="block font-normal text-charcoal">
                      {card.titlePrefix}
                    </span>
                    <span className="block font-bold text-brand">
                      {card.titleCategory}
                    </span>
                  </h3>
                </div>
                <p className="mt-2 text-sm font-semibold">{card.tagline}</p>
                <span className="mt-4 mb-4 block h-0.5 w-24 bg-brand" />
                <p className="text-sm leading-relaxed text-pretty">
                  {card.description}
                </p>

                <p className="mt-5 text-sm font-semibold">
                  BMT Decor cung cấp:
                </p>
                <ul className="mt-2 grid gap-1.5">
                  {card.checklist.map((item) => (
                    <li className="flex items-start gap-2 text-sm" key={item}>
                      <Image
                        className="mt-0.5 size-4 shrink-0 object-contain"
                        src="/images/services/icon-house.png"
                        alt=""
                        width={86}
                        height={91}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <PillCtaButton
                  className="mt-6 w-fit max-w-full"
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
