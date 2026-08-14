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
      className={`group/frame relative size-full overflow-hidden rounded-[1.5rem] border-4 border-white sm:rounded-[3rem] sm:border-6 shadow-[0_18px_40px_rgb(36_33_34/.18)] ${className ?? ""}`}
    >
      <Image
        className="object-cover transition-transform duration-500 ease-out group-hover/frame:scale-110 group-active/frame:scale-110"
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
    //
    // Từ lg chiều cao ăn theo CHIỀU CAO BANNER thay vì cố định 30rem, nếu không
    // thì từ 1536px trở lên banner cao ra mà cụm ảnh đứng yên, thừa cả trăm px
    // trắng phía dưới. Trừ 8.8125rem = 113px (đỉnh cụm, tức đáy header 85px +
    // 28px) + 28px (lề dưới) — hai lề bằng nhau nên cụm nằm cân giữa header và
    // đáy banner. Muốn cụm dài thêm thì giảm ĐỒNG THỜI số này và `lg:mt-` bên
    // RenovationServicePage, nếu không hai lề sẽ lệch.
    // CHÚ Ý: `clamp(...)` phải trùng với `lg:h-` trong SERVICE_HERO_CLASS_NAME.
    //
    // `grid-rows-[6.5fr_3.5fr]`: ô trên-trái 6,5 phần, ô dưới-trái 3,5 phần.
    //
    // `lg:max-w-[36.5rem]`: không có nó thì cụm ăn trọn 660px của cột phải (55%
    // của container 1200px) và ba khung ảnh bè ngang. Chặn ở 584px cho khung
    // đứng hơn; `ml-auto` giữ cụm dán mép phải như cũ.
    <div className="ml-auto grid h-[min(26.25rem,100vw)] w-full max-w-180 grid-cols-2 grid-rows-[6.5fr_3.5fr] gap-2.5 sm:h-[28.75rem] sm:gap-4 lg:h-[calc(clamp(35rem,38.9vw,47.5rem)-8.8125rem)] lg:max-w-[36.5rem] lg:gap-2.5">
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
