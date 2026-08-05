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
      className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 hover:z-40"
      style={{ left, top, height: size, zIndex }}
    >
      <Reveal className="group/frame size-full" delay={delay} from="fade">
        <div className="relative size-full rotate-45 overflow-hidden rounded-[12%] shadow-[0_10px_18px_rgb(36_33_34/.14),0_32px_60px_rgb(36_33_34/.26)] transition-shadow duration-300 ease-out hover:shadow-[0_14px_24px_rgb(36_33_34/.18),0_38px_70px_rgb(36_33_34/.34)]">
          {/* Đã giảm scale từ [1.2] xuống 100 để hình hiển thị đầy đủ, không bị crop quá nhiều */}
          <div className="absolute inset-0 -rotate-45 scale-100">
            <Image
              className="object-cover transition-transform duration-500 ease-out group-hover/frame:scale-105"
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 45vw, 30vw"
              priority
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
