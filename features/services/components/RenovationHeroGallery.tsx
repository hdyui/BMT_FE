"use client";

import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";

type HeroPhoto = { image: string; alt: string };

type RenovationHeroGalleryProps = {
  large: HeroPhoto;
  top: HeroPhoto;
  bottom: HeroPhoto;
};

function PhotoFrame({
  photo,
  className,
}: {
  photo: HeroPhoto;
  className?: string;
}) {
  return (
    <div
      className={`group/frame relative size-full overflow-hidden rounded-[28px] border-[6px] border-white shadow-[0_18px_40px_rgb(36_33_34/.18)] ${className ?? ""}`}
    >
      <Image
        className="object-cover transition-transform duration-500 ease-out group-hover/frame:scale-110"
        src={photo.image}
        alt={photo.alt}
        fill
        sizes="(max-width: 1024px) 60vw, 30vw"
      />
    </div>
  );
}

export function RenovationHeroGallery({
  large,
  top,
  bottom,
}: RenovationHeroGalleryProps) {
  return (
    // THAY ĐỔI: Trả h về 480px an toàn, nhưng nới max-w lên 720px để ảnh bung rộng ra
    <div className="ml-auto grid h-[420px] w-full max-w-[720px] grid-cols-2 grid-rows-[1.3fr_1fr] gap-4 sm:h-[460px] xl:h-[480px]">
      <Reveal className="col-start-1 row-start-1" delay={160} from="right">
        <PhotoFrame photo={top} />
      </Reveal>

      <Reveal className="col-start-1 row-start-2" delay={320} from="right">
        <PhotoFrame photo={bottom} />
      </Reveal>

      <Reveal
        className="col-start-2 row-span-2 row-start-1"
        delay={0}
        from="right"
      >
        <PhotoFrame photo={large} />
      </Reveal>
    </div>
  );
}
