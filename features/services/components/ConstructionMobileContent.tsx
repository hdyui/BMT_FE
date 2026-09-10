import Image from "next/image";

import { BuildingRule } from "@/shared/components/BuildingRule";
import { Reveal } from "@/shared/components/Reveal";
import { DiamondPhotoFrame } from "@/features/services/components/DiamondPhotoFrame";
import { processSteps } from "@/features/services/data/construction";

const MOBILE_ROOT = "/images/thi-cong-xay-dung/mobile";

const mobileHeroDiamonds = [
  {
    key: "top",
    src: "/images/thi-cong-xay-dung/hero-frame-top.webp",
    alt: "Thi công nhà hàng",
    left: "41.5%",
    top: "53.9%",
    size: "31.8%",
    zIndex: 10,
  },
  {
    key: "right",
    src: "/images/thi-cong-xay-dung/hero-frame-right.webp",
    alt: "Thi công thẩm mỹ viện",
    left: "86.5%",
    top: "66%",
    size: "19.4%",
    zIndex: 20,
  },
  {
    key: "bottom",
    src: "/images/thi-cong-xay-dung/hero-frame-bottom.webp",
    alt: "Thi công nhà ở",
    left: "60.9%",
    top: "88%",
    size: "27.5%",
    zIndex: 40,
  },
  {
    key: "left",
    src: "/images/thi-cong-xay-dung/hero-frame-left.webp",
    alt: "Thi công văn phòng",
    left: "16.7%",
    top: "79.4%",
    size: "20.2%",
    zIndex: 30,
  },
] as const;

export function ConstructionMobileHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F2F2F3] md:hidden">
      {/* ẢNH LÊN TRÊN: cụm 4 hình kim cương giữ NGUYÊN mọi toạ độ % trong khung
          tỉ lệ gốc 3884/5972. KHÔNG cắt hình top nữa — bỏ `pt-[60px]` để section
          bắt đầu từ đỉnh trang (y=0), kéo khung gốc lên 35%: cụm hạ thấp xuống
          một chút, mép trên hình top ở ~y=0; SiteHeader fixed cao 60px (z-50)
          ĐÈ LÊN che phần trên hình top, phần còn lại hiện đủ. Núm chỉnh mắt:
          `-translate-y-[35%]` (giảm số = cụm tụt thấp xuống, header che ít hơn),
          `h-[102vw]` (chiều cao vùng chứa — tăng nếu hình bottom bị mép dưới
          cắt). */}
      <div className="relative h-[110vw] w-full">
        <div className="absolute inset-x-0 top-0 aspect-3884/5972 w-full -translate-y-[32%]">
          {/* Bóng nền — 5 lớp Y HỆT desktop (`ConstructionServicePage`), toạ độ
              được chiếu từ bounding-box cụm diamond desktop sang bounding-box
              cụm diamond mobile (khung này). `z-[1]` (dưới diamonds) nên chỉ
              hiện ở khoảng trống. Fade-in lần lượt, delay tăng dần. */}
          <Reveal
            className="pointer-events-none absolute top-[44%] left-[-15%] z-[1] h-[56%] w-[140%]"
            delay={200}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain mix-blend-multiply"
              src="/images/thi-cong-xay-dung/hero-shadows/cluster-center.png"
              alt=""
              fill
              sizes="130vw"
              aria-hidden="true"
            />
          </Reveal>
          <Reveal
            className="pointer-events-none absolute top-[50%] left-[-15%] z-[1] h-[56%] w-[140%]"
            delay={340}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain mix-blend-multiply [filter:brightness(.78)_contrast(1.55)]"
              src="/images/thi-cong-xay-dung/hero-shadows/cluster-center-2.png"
              alt=""
              fill
              sizes="130vw"
              aria-hidden="true"
            />
          </Reveal>
          <Reveal
            className="pointer-events-none absolute top-[58%] left-[-8%] z-[1] h-[43%] w-[111%] -rotate-90"
            delay={480}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain mix-blend-multiply"
              src="/images/thi-cong-xay-dung/hero-shadows/bottom-left-corner.png"
              alt=""
              fill
              sizes="110vw"
              aria-hidden="true"
            />
          </Reveal>
          <Reveal
            className="pointer-events-none absolute top-[57%] left-[-44%] z-[1] h-[53%] w-[126%] rotate-90 opacity-40"
            delay={620}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain mix-blend-multiply"
              src="/images/thi-cong-xay-dung/hero-shadows/left-corner.png"
              alt=""
              fill
              sizes="120vw"
              aria-hidden="true"
            />
          </Reveal>
          <Reveal
            className="pointer-events-none absolute top-[48%] left-[-20%] z-[1] h-[47%] w-[133%] -scale-x-100 -rotate-45 opacity-40"
            delay={760}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain mix-blend-multiply"
              src="/images/thi-cong-xay-dung/hero-shadows/bottom-left-corner.png"
              alt=""
              fill
              sizes="130vw"
              aria-hidden="true"
            />
          </Reveal>
          {/* `title-diamond.png` — bên desktop nằm phía trên tiêu đề (góc phải
              banner). Mobile không có tiêu đề ở cụm này nên đặt thẳng vào GÓC
              PHẢI banner. Núm: `left`/`top`/`w`/`h`. */}
          <Reveal
            className="pointer-events-none absolute top-[36%] left-[64%] z-[2] h-[46%] w-[48%]"
            delay={880}
            duration={750}
            from="fade"
            aria-hidden="true"
          >
            <Image
              className="object-contain object-top mix-blend-multiply [filter:brightness(.8)_contrast(1.45)]"
              src="/images/thi-cong-xay-dung/hero-shadows/title-diamond.png"
              alt=""
              fill
              sizes="46vw"
              aria-hidden="true"
            />
          </Reveal>

          {/* Viền sắc `#dedee1` ló ra ở cạnh trái mỗi hình — y hệt
              `HERO_BACKDROPS` bên desktop: tấm kim cương cùng kích thước, dời
              `-7.5%` KÍCH THƯỚC CHÍNH NÓ nên sliver tự scale theo mỗi hình.
              Vẽ TRƯỚC 4 ảnh nên chỉ ló mép trái. */}
          {mobileHeroDiamonds.map((diamond, index) => (
            <Reveal
              key={`edge-${diamond.key}`}
              className="pointer-events-none absolute z-[2] aspect-square"
              delay={80 + index * 90}
              duration={650}
              from="fade"
              style={{
                left: diamond.left,
                top: diamond.top,
                height: diamond.size,
                transform: "translate(calc(-50% + -7.5%), -50%)",
              }}
              aria-hidden="true"
            >
              <div className="size-full rotate-45 rounded-[16%] bg-[#dedee1]" />
            </Reveal>
          ))}

          {mobileHeroDiamonds.map((diamond, index) => (
            <DiamondPhotoFrame
              key={diamond.key}
              src={diamond.src}
              alt={diamond.alt}
              left={diamond.left}
              top={diamond.top}
              size={diamond.size}
              zIndex={diamond.zIndex}
              delay={160 + index * 160}
            />
          ))}
        </div>
      </div>

      {/* CHỮ XUỐNG DƯỚI: nối ngay sau cụm hình theo luồng thường. Trước đây khối
          này `absolute top-[calc(85px+5vw)]`; nay bỏ absolute, canh bằng margin
          — nội dung bên trong giữ nguyên. */}
      <div className="mt-[12vw] mb-[9vw] mr-[3.5%] ml-[7.3%] flex items-start gap-[3vw]">
        <Reveal className="h-[20vw] shrink-0" from="fade">
          <span
            className="block h-full w-[0.55vw] rounded-full bg-brand"
            aria-hidden="true"
          />
        </Reveal>
        <div className="min-w-0 pt-[0.4vw]">
          <Reveal>
            {/* Tiêu đề này là MỘT dòng `whitespace-nowrap` (theo mockup), chỗ
                trống chỉ có 85,65vw (7,3% -> 96,5%, trừ vạch 0,55vw và gap 3vw)
                nên không nhét được 5,9vw như các trang kia — 5,9vw cần 90vw,
                tràn khỏi màn hình. 5,55vw là cỡ lớn nhất còn đủ một dòng và
                cũng chính là cỡ trong mockup (436/512 ink = 5,68vw). */}
            <h1 className="font-heading text-[clamp(1.1rem,5.55vw,1.65rem)] leading-[1.12] font-extrabold whitespace-nowrap text-brand uppercase">
              Dịch vụ thi công xây dựng
            </h1>
          </Reveal>
          <BuildingRule
            className="mt-2 h-5 w-[35.5vw] max-w-none"
            src="/images/services/rule-dark.png"
            delay={160}
          />
          <Reveal
            className="mt-2 flex items-center gap-[0.2em] whitespace-nowrap text-[clamp(0.55rem,2.85vw,0.7rem)]"
            delay={300}
            from="left"
          >
            <Image
              className="relative -top-[0.12em] size-[1.1em] shrink-0 object-contain"
              src="/images/thi-cong-xay-dung/icon-house.png"
              alt=""
              width={90}
              height={95}
              aria-hidden="true"
            />
            <p className="text-[clamp(0.55rem,2.85vw,0.7rem)] leading-relaxed text-charcoal">
              Đồng Hành Kiến Tạo Công Trình Bền Vững
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const processTitles = [
  "Khảo sát công trình & tiếp nhận hồ sơ",
  "Lập biện pháp & tiến độ thi công",
  "Thi công xây dựng phần thô",
  "Thi công hoàn thiện công trình",
  "Nghiệm thu & Bàn giao",
] as const;

// Tâm thực của năm vòng tròn cam trong `process-timeline.webp`. Giữ tọa độ
// số độc lập với tiêu đề để cả hai có thể được căn quang học chính xác.
const processNumberTops = [6.55, 25.6, 44.64, 63.67, 84.11] as const;
const processTitleTops = [5.9, 25.55, 45.25, 64.6, 84.65] as const;
/* Tâm dọc của năm khối cam, đo trực tiếp trên `process-timeline.webp`
   (3056x6831): mỗi khối cao 673px (9.85% chiều cao ảnh), lần lượt ở
   709-1381, 2010-2682, 3310-3982, 4611-5283, 6007-6679 px. Khối mô tả dùng
   `-translate-y-1/2` nên đặt đúng các tâm này là chữ cách đều trên/dưới nền cam. */
const processDescriptionTops = [15.3, 34.34, 53.37, 72.42, 92.86] as const;

export function ConstructionMobileProcess() {
  return (
    <div className="relative mx-auto aspect-3056/6831 w-[82%] md:hidden">
      <Reveal className="absolute inset-0" from="fade">
        <Image
          className="object-contain"
          src={`${MOBILE_ROOT}/process-timeline.webp`}
          alt=""
          fill
          sizes="82vw"
          aria-hidden="true"
        />
      </Reveal>

      {processSteps.map((step, index) => {
        const base = index * 160;

        return (
          <div className="contents" key={step.number}>
            {/* Số thứ tự: zoom nhẹ kết hợp fade */}
            <span
              className="absolute left-0 flex w-[20.6%] -translate-y-1/2 items-center justify-center"
              style={{ top: `${processNumberTops[index]}%` }}
            >
              <Reveal delay={base} from="zoom">
                <span className="font-heading text-[clamp(1.9rem,8.2vw,3.8rem)] leading-none font-extrabold text-black">
                  {step.number}
                </span>
              </Reveal>
            </span>

            {/* Tiêu đề: trượt từ trái sang phải và hiện dần */}
            <div
              className="absolute left-[32.5%] w-[71%] -translate-y-1/2"
              style={{ top: `${processTitleTops[index]}%` }}
            >
              <Reveal delay={base + 90} from="left">
                <h3 className="font-heading text-[3.25vw] leading-none font-extrabold whitespace-nowrap text-black">
                  {processTitles[index]}
                </h3>
              </Reveal>
            </div>

            {/* Khối nội dung màu cam (mô tả đặt trong khối): trượt từ trái
                sang phải và hiện dần, theo ngay sau tiêu đề. */}
            <div
              className="absolute left-[52.5%] w-[41%] -translate-y-1/2"
              style={{ top: `${processDescriptionTops[index]}%` }}
            >
              <Reveal delay={base + 180} from="left">
                <p className="text-justify text-[clamp(0.67rem,2.72vw,1.28rem)] leading-[1.08] text-white">
                  {step.description}
                </p>
              </Reveal>
            </div>
          </div>
        );
      })}
    </div>
  );
}
