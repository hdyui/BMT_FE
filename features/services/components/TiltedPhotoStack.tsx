"use client";

import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";

type TiltedPhotoStackProps = {
  cards: readonly { image: string; alt: string }[];
};

const rotations = ["-rotate-6", "-rotate-1", "rotate-4"] as const;
const offsets = ["left-0", "left-[18%]", "left-[36%]"] as const;
const zIndexes = ["z-10", "z-20", "z-30"] as const;

export function TiltedPhotoStack({ cards }: TiltedPhotoStackProps) {
  return (
    <div className="relative h-[420px] w-full max-w-[520px] sm:h-[480px]">
      {cards.map((card, index) => (
        <Reveal
          className={`group absolute top-0 h-full w-[46%] ${offsets[index]} ${zIndexes[index]} hover:z-40`}
          delay={index * 160}
          from="left"
          key={card.image}
        >
          <div
            className={`size-full origin-bottom overflow-hidden rounded-[28px] border-[6px] border-white shadow-[0_18px_40px_rgb(36_33_34/.22)] transition-[box-shadow,transform] duration-300 ease-out ${rotations[index]} group-hover:shadow-[0_24px_54px_rgb(36_33_34/.32)]`}
          >
            <div className="relative size-full overflow-hidden">
              <Image
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                src={card.image}
                alt={card.alt}
                fill
                sizes="240px"
              />
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
