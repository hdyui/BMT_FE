import Image from "next/image";
import { Reveal } from "@/shared/components/Reveal";

type MobileHeroArtworkProps = {
  variant: "design" | "full-construction";
  /** Ảnh artwork từ API. */
  src: string;
};

const artwork = {
  design: {
    clips: [
      {
        path: "polygon(20% 27%, 52% 27%, 30% 100%, 0 100%, 0 58%)",
        origin: "26% 64%",
      },
      {
        path: "polygon(45% 32%, 76% 32%, 55% 100%, 25% 100%)",
        origin: "51% 66%",
      },
      {
        path: "polygon(70% 24%, 100% 24%, 100% 100%, 48% 100%)",
        origin: "77% 62%",
      },
    ],
  },
  "full-construction": {
    clips: [
      {
        path: "polygon(36% 24%, 78% 24%, 78% 60%, 36% 60%)",
        origin: "57% 42%",
      },
      {
        path: "polygon(0 36%, 48% 36%, 48% 70%, 0 70%)",
        origin: "24% 53%",
      },
      {
        path: "polygon(37% 50%, 100% 50%, 100% 82%, 37% 82%)",
        origin: "69% 66%",
      },
      {
        path: "polygon(5% 61%, 52% 61%, 52% 100%, 5% 100%)",
        origin: "29% 81%",
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
export function MobileHeroArtwork({ variant, src }: MobileHeroArtworkProps) {
  const preset = { ...artwork[variant], src };

  return (
    // ẢNH LÊN TRÊN: artwork mobile (đã ghép sẵn, chừa ~24% rỗng ở đỉnh cho khối
    // chữ) nay đứng theo luồng thường ở đầu banner. Bọc khung cắt
    // (`overflow-hidden` + `h-[108vw]`) rồi kéo canvas gốc lên 30% để bỏ dải
    // rỗng phía trên (artwork chỉ phủ ảnh kín bề ngang từ ~32%) — các vùng ảnh
    // (clip-path) giữ nguyên toạ độ. Núm chỉnh mắt: `h-[108vw]` (chiều cao ô
    // nhìn thấy), `-translate-y-[30%]` (cắt rỗng trên bao nhiêu; giảm số = ảnh
    // tụt thấp xuống).
    <div className="pointer-events-none relative h-[108vw] w-full overflow-hidden md:hidden">
      <div className="absolute inset-x-0 top-0 aspect-3884/5972 w-full -translate-y-[30%]">
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
              className="object-fill"
              src={preset.src}
              alt=""
              fill
              sizes="100vw"
              loading="eager"
              style={{ transformOrigin: clip.origin }}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
