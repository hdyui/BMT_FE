"use client";

import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";

type DiamondPhotoFrameProps = {
  src: string;
  alt: string;
  left: string;
  top: string;
  size: string;
  zIndex: number;
  delay?: number;
};

export function DiamondPhotoFrame({
  src,
  alt,
  left,
  top,
  size,
  zIndex,
  delay = 0,
}: DiamondPhotoFrameProps) {
  return (
    <div
      className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 hover:z-50"
      style={{ left, top, height: size, zIndex }}
    >
      <Reveal className="group/frame size-full" delay={delay} from="fade">
        {/* rounded-[16%]: đúng độ bo của 4 hình trong mockup (đo được ~15% cạnh).
            Để 12% như trước thì bốn đỉnh kim cương lòi ra ngoài góc bo của ảnh
            và hở một mẩu nền sáng. */}
        {/* KHÔNG đặt box-shadow ở đây. Khối này đã xoay 45° nên box-shadow bị
            xoay theo: `0 Ypx` hoá ra đổ về phía dưới-TRÁI trên màn hình, và nó
            đổ giống hệt nhau cho cả bốn hình. Mockup thì mỗi hình một kiểu (xem
            bảng đo ở HERO_BACKDROPS trong ConstructionServicePage), nên bóng
            được vẽ bằng các tấm nền riêng nằm dưới, không phải bằng box-shadow. */}
        <div className="relative size-full rotate-45 overflow-hidden rounded-[16%]">
          {/* scale √2 — KHÔNG được bỏ. `inset-0` chỉ cho ô ảnh bằng đúng hình
              vuông TRƯỚC khi xoay, mà hình vuông đã xoay 45° lại có hộp bao rộng
              gấp √2. Để scale-100 thì bốn đỉnh kim cương nằm ngoài ô ảnh và bị
              trống — đó là lý do ảnh cũ "không khớp khung".
              Ảnh nguồn (hero-diamond-*.webp) được cắt đúng bằng hộp bao này nên
              với hệ số √2 là trùng khít 1:1 với mockup. */}
          <div className="absolute inset-0 -rotate-45 scale-[1.41422]">
            <Image
              className="object-cover transition-transform duration-500 ease-out group-hover/frame:scale-105"
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 64vw, 43vw"
              priority
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
