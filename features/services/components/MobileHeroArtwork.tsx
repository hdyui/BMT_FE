import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";

type MobileHeroArtworkProps = {
  variant: "design" | "full-construction";
};

const artwork = {
  design: {
    src: "/images/thiet-ke-kien-truc-noi-that/mobile/hero-artwork.png",
    clips: [
      {
        path: "polygon(20% 27%, 52% 27%, 30% 100%, 0 100%, 0 58%)",
        origin: "26% 64%",
        alt: "Không gian showroom do BMT Decor thiết kế nội thất",
      },
      {
        path: "polygon(45% 32%, 76% 32%, 55% 100%, 25% 100%)",
        origin: "51% 66%",
        alt: "Không gian nhà phố do BMT Decor thiết kế nội thất",
      },
      {
        path: "polygon(70% 24%, 100% 24%, 100% 100%, 48% 100%)",
        origin: "77% 62%",
        alt: "Không gian spa do BMT Decor thiết kế nội thất",
      },
    ],
  },
  "full-construction": {
    src: "/images/xay-dung-tron-goi/mobile/hero-artwork.png",
    clips: [
      {
        path: "polygon(36% 24%, 78% 24%, 78% 60%, 36% 60%)",
        origin: "57% 42%",
        alt: "Văn phòng do BMT Decor thiết kế và thi công",
      },
      {
        path: "polygon(0 36%, 48% 36%, 48% 70%, 0 70%)",
        origin: "24% 53%",
        alt: "Phòng khách do BMT Decor thiết kế và thi công",
      },
      {
        path: "polygon(37% 50%, 100% 50%, 100% 82%, 37% 82%)",
        origin: "69% 66%",
        alt: "Phòng họp do BMT Decor thiết kế và thi công",
      },
      {
        path: "polygon(5% 61%, 52% 61%, 52% 100%, 5% 100%)",
        origin: "29% 81%",
        alt: "Phòng ăn do BMT Decor thiết kế và thi công",
      },
    ],
  },
} as const;

/**
 * Artwork mobile được đặt trên đúng canvas 3884 x 5972 của file thiết kế.
 * Mỗi bản sao chỉ hé lộ một vùng ảnh, sau đó lớp tổng thể xuất hiện để bổ sung
 * các nét trang trí. Vì mọi lớp dùng chung một canvas nên trạng thái cuối không
 * thể lệch vị trí hoặc tỷ lệ so với mockup gốc.
 */
export function MobileHeroArtwork({ variant }: MobileHeroArtworkProps) {
  const preset = artwork[variant];

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 aspect-3884/5972 w-full md:hidden">
      <Reveal
        className="pointer-events-none absolute inset-0 z-0"
        delay={260 + preset.clips.length * 130}
        duration={700}
        from="fade"
      >
        <Image
          className="object-fill"
          src={preset.src}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          aria-hidden="true"
        />
      </Reveal>

      {preset.clips.map((clip, index) => (
        <Reveal
          className="group/frame pointer-events-auto absolute inset-0 z-10"
          delay={260 + index * 130}
          duration={620}
          from="fade"
          key={clip.path}
          style={{ clipPath: clip.path }}
        >
          <Image
            className="object-fill transition-transform duration-500 ease-out group-hover/frame:scale-105 group-active/frame:scale-105 motion-reduce:scale-100 motion-reduce:transition-none"
            src={preset.src}
            alt={clip.alt}
            fill
            sizes="100vw"
            loading="eager"
            style={{ transformOrigin: clip.origin }}
          />
        </Reveal>
      ))}
    </div>
  );
}
