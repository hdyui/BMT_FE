import Image from "next/image";

export function HexagonShowcase() {
  return (
    <div className="relative aspect-[3600/3468] w-full">
      <Image
        className="object-contain object-left"
        src="/images/xay-dung-tron-goi/hero-hexagons.webp"
        alt="Các công trình tiêu biểu do BMT Decor thiết kế thi công"
        fill
        sizes="(max-width: 1024px) 90vw, 520px"
        priority
      />
    </div>
  );
}
