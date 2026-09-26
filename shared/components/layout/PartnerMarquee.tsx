"use client";

import { useState } from "react";
import Image from "next/image";

export type PartnerDisplayItem = {
  name: string;
  image: string;
};

function PartnerSequence({
  hidden = false,
  hovered,
  onHover,
  partners,
}: {
  hidden?: boolean;
  hovered: string | null;
  onHover: (name: string | null) => void;
  partners: PartnerDisplayItem[];
}) {
  return (
    <div className="flex w-1/2 shrink-0" aria-hidden={hidden}>
      {partners.map((partner) => (
        <div
          className="w-1/6 shrink-0 px-2.5 max-sm:px-1.5"
          key={partner.name}
          onPointerEnter={() => onHover(partner.name)}
          onPointerLeave={() => onHover(null)}
        >
          <Image
            className={`block h-auto w-full transition-[filter,opacity,transform] duration-500 ease-out max-sm:mx-auto max-sm:w-[88%] ${
              hovered === partner.name
                ? "scale-[1.025] opacity-100 [filter:grayscale(0)_contrast(1)]"
                : "opacity-90 [filter:grayscale(1)_contrast(1.25)] max-sm:[filter:none]"
            }`}
            src={partner.image}
            alt={hidden ? "" : partner.name}
            width={293}
            height={234}
            sizes="(max-width: 640px) 30vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}

export function PartnerMarquee({
  partners,
}: {
  partners: PartnerDisplayItem[];
}) {
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  if (partners.length === 0) return null;

  return (
    <div
      className="mx-auto mt-8 w-full overflow-hidden py-3"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        setPaused(false);
        setHovered(null);
      }}
    >
      <div
        className="flex w-[300%] [animation:partner-marquee_22s_linear_infinite] motion-reduce:animate-none max-sm:w-[400%]"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        <PartnerSequence
          partners={partners}
          hovered={hovered}
          onHover={setHovered}
        />
        <PartnerSequence
          partners={partners}
          hidden
          hovered={hovered}
          onHover={setHovered}
        />
      </div>
    </div>
  );
}
