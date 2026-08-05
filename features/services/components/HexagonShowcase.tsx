import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";

const CLUSTER = "/images/xay-dung-tron-goi/hero-cluster.png";

/**
 * Các đường cắt (clipPath) lúc này được tính toán lại thành lưới Voronoi hoàn hảo.
 * Chúng đi qua chính giữa các khe hở trong suốt, KHÔNG CHỒNG LÊN NHAU và KHÔNG TRÀN RA NỀN TRẮNG.
 * Nhờ vậy, chấm dứt hoàn toàn hiện tượng nháy ảnh hoặc hover vùng trắng mà ảnh lại zoom.
 */
const clusterLayers = [
  {
    key: "left",
    alt: "Không gian nhà hàng do BMT Decor thiết kế thi công",
    clipPath:
      "polygon(0% 28%, 20.2% 20%, 40.5% 30%, 40.5% 52.5%, 20.2% 64%, 0% 55%)",
    transformOrigin: "20.2% 43%",
    order: 0,
  },
  {
    key: "top",
    alt: "Phòng họp văn phòng do BMT Decor thiết kế thi công",
    clipPath: "polygon(40.5% 0%, 83% 0%, 83% 50%, 60.2% 61.7%, 40.5% 52.5%)",
    transformOrigin: "60.6% 30%",
    order: 2,
  },
  {
    key: "bottom",
    alt: "Phòng ăn căn hộ do BMT Decor thiết kế thi công",
    clipPath:
      "polygon(20.2% 64%, 40.5% 52.5%, 60.2% 61.7%, 60.2% 100%, 20.2% 100%)",
    transformOrigin: "40.4% 77%",
    order: 1,
  },
  {
    key: "right",
    alt: "Phòng khách kết hợp góc làm việc do BMT Decor thiết kế thi công",
    clipPath: "polygon(60.2% 61.7%, 83% 50%, 100% 50%, 100% 95%, 60.2% 95%)",
    transformOrigin: "79.8% 71%",
    order: 3,
  },
] as const;

export function HexagonShowcase() {
  return (
    <div className="relative aspect-[3467/4070] w-full">
      {/* 1. Hình lục giác xám góc trái trên cùng */}
      <Reveal
        className="absolute top-[-4%] left-[2%] w-[25%] -z-20"
        from="fade"
        delay={0}
      >
        <Image
          className="h-auto w-full opacity-80"
          src="/images/xay-dung-tron-goi/hero-gray-hex-small.png"
          alt=""
          width={355}
          height={392}
          aria-hidden="true"
        />
      </Reveal>

      {/* 2. Họa tiết đường uốn lượn cam góc trái trên */}
      <Reveal
        className="absolute top-[-1%] left-[10%] w-[22%] -z-10"
        from="fade"
        delay={100}
      >
        <Image
          className="h-auto w-full"
          src="/images/xay-dung-tron-goi/hero-curves.png"
          alt=""
          width={892}
          height={1616}
          aria-hidden="true"
        />
      </Reveal>

      {/* 3. Hình lục giác xám LỚN nằm phụ phía sau lưng cụm hình */}
      <Reveal
        className="absolute top-[30%] left-[6%] w-[38%] -z-20 opacity-70"
        from="fade"
        delay={250}
      >
        <Image
          className="h-auto w-full"
          src="/images/xay-dung-tron-goi/hero-gray-hex-bottom.png"
          alt=""
          width={782}
          height={1077}
          aria-hidden="true"
        />
      </Reveal>

      {/* 4. Hình lục giác viền cam góc trái dưới */}
      <Reveal
        className="absolute bottom-[2%] left-[0%] w-[12%] z-10"
        from="fade"
        delay={300}
      >
        <Image
          className="h-auto w-full"
          src="/images/xay-dung-tron-goi/hero-hex-outline.png"
          alt=""
          width={323}
          height={352}
          aria-hidden="true"
        />
      </Reveal>

      {/* 5. Hình lục giác xám góc phải dưới */}
      <Reveal
        className="absolute top-[75%] left-[85%] w-[14%] -z-10"
        from="fade"
        delay={200}
      >
        <Image
          className="h-auto w-full"
          src="/images/xay-dung-tron-goi/hero-gray-hex-top.png"
          alt=""
          width={782}
          height={1077}
          aria-hidden="true"
        />
      </Reveal>

      {/* 4 Cụm hình ảnh trung tâm */}
      {clusterLayers.map((layer) => (
        <Reveal
          className="group/hex absolute inset-0 z-0 hover:z-10"
          style={{ clipPath: layer.clipPath }}
          delay={380 + layer.order * 130}
          from="left"
          key={layer.key}
        >
          {/* LỚP MASK TĨNH: Khóa chặt viền bo tròn, không cho biến dạng */}
          <div
            className="relative size-full"
            style={{
              WebkitMaskImage: `url('${CLUSTER}')`,
              WebkitMaskSize: "contain",
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              maskImage: `url('${CLUSTER}')`,
              maskSize: "contain",
              maskPosition: "center",
              maskRepeat: "no-repeat",
            }}
          >
            {/* ẢNH CHUYỂN ĐỘNG: Chỉ zoom hình bên trong, viền đứng im */}
            <Image
              className="object-contain transition-transform duration-500 ease-out group-hover/hex:scale-105 will-change-transform"
              style={{ transformOrigin: layer.transformOrigin }}
              src={CLUSTER}
              alt={layer.alt}
              fill
              sizes="(max-width: 1024px) 92vw, 44vw"
              priority
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
