import Image from "next/image";
import Link from "next/link";

import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import {
  processSteps,
  solutionCards,
} from "@/features/services/data/thi-cong-xay-dung";

const MOBILE_ROOT = "/images/thi-cong-xay-dung/mobile";

const mobileCards = [
  {
    background: `${MOBILE_ROOT}/solution-house.webp`,
    backgroundWidth: 3721,
    backgroundHeight: 5259,
    line1: "THI CÔNG XÂY DỰNG",
    line2: "NHÀ Ở",
    checklist: [
      "Xây dựng phần thô nhà phố",
      "Xây dựng phần thô biệt thự",
      "Thi công xây dựng và hoàn thiện nhà ở",
    ],
    button: `${MOBILE_ROOT}/btn-house.png`,
    buttonWidth: 1668,
    buttonHeight: 253,
    buttonPercent: 49,
  },
  {
    background: `${MOBILE_ROOT}/solution-office.webp`,
    backgroundWidth: 3721,
    backgroundHeight: 5525,
    line1: "THI CÔNG",
    line2: "VĂN PHÒNG",
    checklist: [
      "Thi công xây dựng văn phòng",
      "Xây dựng phần thô và hoàn thiện văn phòng",
      "Cải tạo văn phòng",
    ],
    button: `${MOBILE_ROOT}/btn-office.png`,
    buttonWidth: 1978,
    buttonHeight: 253,
    buttonPercent: 66,
  },
  {
    background: `${MOBILE_ROOT}/solution-showroom.webp`,
    backgroundWidth: 3721,
    backgroundHeight: 5305,
    line1: "THI CÔNG",
    line1Accent: "SHOWROOM &",
    line2: "THẨM MỸ VIỆN",
    checklist: ["Thi công showroom, cửa hàng", "Thi công spa, thẩm mỹ viện"],
    button: `${MOBILE_ROOT}/btn-showroom.png`,
    buttonWidth: 2682,
    buttonHeight: 253,
    buttonPercent: 92,
  },
  {
    background: `${MOBILE_ROOT}/solution-hospitality.webp`,
    backgroundWidth: 3738,
    backgroundHeight: 5334,
    line1: "THI CÔNG",
    line1Accent: "NHÀ HÀNG &",
    line2: "KHÁCH SẠN",
    checklist: [
      "Thi công nhà hàng, khách sạn, quán café",
      "Thi công sảnh, phòng lưu trú và không gian dịch vụ",
    ],
    button: `${MOBILE_ROOT}/btn-hospitality.png`,
    buttonWidth: 2939,
    buttonHeight: 253,
    buttonPercent: 88,
  },
] as const;

const processTitles = [
  "Khảo sát công trình & tiếp nhận hồ sơ",
  "Lập biện pháp & tiến độ thi công",
  "Thi công xây dựng phần thô",
  "Thi công hoàn thiện công trình",
  "Nghiệm thu & Bàn giao",
] as const;

const processTitleTops = [5.9, 25.55, 45.25, 64.95, 84.65] as const;
const processDescriptionTops = [14.55, 34.25, 53.95, 73.65, 93.35] as const;

export function ConstructionMobileHero() {
  return (
    // Ảnh `hero-artwork.webp` là MỘT tấm PNG dẹt đã ghép sẵn cụm ảnh kim
    // cương, chỉ chừa đúng ~32,5% chiều cao rỗng phía trên cho khối chữ.
    // Trước đây khối chữ nằm ĐÈ lên ảnh (absolute + top-%) nên chừa thêm
    // khoảng trắng dưới header = đẩy chữ xuống sâu hơn vào đúng vùng ảnh có
    // nội dung -> chữ đè lên ảnh. Sửa bằng cách KHÔNG co giãn ảnh nữa: section
    // cao hơn ảnh đúng 2.5rem (40px), ảnh neo đáy (`bottom-0`) giữ nguyên
    // kích thước/tỉ lệ gốc, phần dư ra tự nhiên thành khoảng trắng THẬT ở
    // đỉnh — chữ dùng `top-32` (128px, khớp 3 banner còn lại) rơi gọn vào
    // khoảng trắng đó thay vì tính theo % của một khối đã bị nới cao.
    <section className="relative h-[calc(153.76vw+2.5rem)] w-full overflow-hidden bg-[#F2F2F3] md:hidden">
      <div className="absolute inset-x-0 bottom-0 aspect-3884/5972 w-full">
        <Image
          className="object-contain object-top"
          src={`${MOBILE_ROOT}/hero-artwork.webp`}
          alt="Các công trình thi công xây dựng của BMT Decor"
          fill
          sizes="100vw"
          priority
        />
      </div>

      {/* `top-32` (128px) khớp khoảng cách header->tiêu đề chuẩn lấy từ
          RenovationMobileHero (~85px header + ~41px khoảng trắng riêng). */}
      <div className="absolute top-32 right-[3.5%] left-[7.3%] flex items-start gap-[3vw]">
        <Reveal className="h-[20vw] shrink-0" from="fade">
          <span
            className="block h-full w-[0.55vw] rounded-full bg-brand"
            aria-hidden="true"
          />
        </Reveal>
        <div className="min-w-0 pt-[0.4vw]">
          <Reveal>
            <h1 className="font-heading text-[clamp(1.35rem,5.25vw,1.55rem)] leading-[1.12] font-extrabold whitespace-nowrap text-brand uppercase">
              Dịch vụ thi công xây dựng
            </h1>
          </Reveal>
          <BuildingRule
            className="mt-2 h-5 w-[35.5vw] max-w-none"
            src="/images/services/rule-dark.png"
            delay={160}
          />
          <Reveal
            className="mt-2 flex items-center gap-2 whitespace-nowrap"
            delay={300}
            from="left"
          >
            <Image
              className="size-3 shrink-0 object-contain"
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

// Ảnh nền chỉ có phần chụp công trình ở ~51.5% phía trên; nửa dưới vốn đã là
// khoảng trắng bỏ trống trong file (không phải panel vẽ sẵn cố định). Thay vì
// đè chữ lên khoảng trắng đó bằng toạ độ % (chiều cao card cố định, chữ dài
// ra là tràn khung), tách hẳn thành 2 khối như cách `SolutionCards` dùng ở
// trang xây dựng trọn gói / thiết kế nội thất: khối ảnh cắt đúng phần chụp
// (tỉ lệ cố định), khối chữ là khung trắng CSS thật, cao theo đúng nội dung.
const PHOTO_RATIO = 0.515;

export function ConstructionMobileSolutionCards() {
  return (
    <div className="mx-auto grid w-[93%] gap-[2.6vw] md:hidden">
      {mobileCards.map((mobileCard, index) => {
        const card = solutionCards[index];

        return (
          <article
            className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_5px_14px_rgb(36_33_34/.28)]"
            key={card.number}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: `${mobileCard.backgroundWidth} / ${mobileCard.backgroundHeight * PHOTO_RATIO}`,
              }}
            >
              {/* File gốc chừa viền trắng mỏng quanh khung ảnh minh hoạ; phóng
                  nhẹ để cắt bỏ viền trắng đó, cho ảnh sát mép khung thẻ. */}
              <Image
                className="scale-110 object-cover object-top"
                src={mobileCard.background}
                alt={card.titleCategory}
                fill
                sizes="93vw"
              />
            </div>

            <div className="px-[7.5%] pt-4 pb-6 text-charcoal">
              <div className="flex min-w-0 items-start gap-3">
                <span className="shrink-0 text-[clamp(2.25rem,11vw,3.5rem)] leading-none font-extrabold text-[#b8babc]">
                  {card.number}.
                </span>
                <h3 className="font-heading mt-1 min-w-0 text-[clamp(0.8125rem,4vw,1.25rem)] leading-tight font-extrabold uppercase">
                  <span>{mobileCard.line1}</span>{" "}
                  {"line1Accent" in mobileCard ? (
                    <span className="text-brand">{mobileCard.line1Accent}</span>
                  ) : null}
                  <br />
                  <span className="text-brand">{mobileCard.line2}</span>
                </h3>
              </div>

              <p className="mt-2 text-sm font-bold">{card.tagline}</p>
              <span className="mt-3 mb-4 block h-0.75 w-24 bg-brand" />

              <p className="text-sm leading-relaxed text-justify">
                {card.description}
              </p>

              <p className="mt-5 text-sm font-bold">BMT Decor cung cấp:</p>
              <ul className="mt-2 grid gap-1.5">
                {mobileCard.checklist.map((item) => (
                  <li className="flex items-start gap-2 text-sm" key={item}>
                    <Image
                      className="mt-0.5 size-4 shrink-0 object-contain"
                      src="/images/thi-cong-xay-dung/icon-house.png"
                      alt=""
                      width={90}
                      height={95}
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                className="relative mt-6 block transition-transform active:scale-[0.98]"
                href="/du-an"
                style={{
                  width: `${mobileCard.buttonPercent}%`,
                  aspectRatio: `${mobileCard.buttonWidth} / ${mobileCard.buttonHeight}`,
                }}
              >
                <Image
                  className="object-fill"
                  src={mobileCard.button}
                  alt=""
                  fill
                  sizes="80vw"
                  aria-hidden="true"
                />
                <span className="absolute inset-0 flex items-center justify-center pr-[11%] pl-[2%] text-[clamp(0.58rem,2.42vw,1.14rem)] leading-none font-extrabold whitespace-nowrap text-white uppercase">
                  {card.cta}
                </span>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ConstructionMobileProcess() {
  return (
    <div className="relative mx-auto aspect-3056/6831 w-[82%] md:hidden">
      <Image
        className="object-contain"
        src={`${MOBILE_ROOT}/process-timeline.webp`}
        alt=""
        fill
        sizes="82vw"
        aria-hidden="true"
      />

      {processSteps.map((step, index) => (
        <div className="contents" key={step.number}>
          <span
            className="absolute left-[1.1%] flex w-[18.5%] -translate-y-1/2 items-center justify-center font-heading text-[clamp(2.6rem,10.8vw,5.1rem)] leading-none font-extrabold text-black"
            style={{ top: `${processTitleTops[index]}%` }}
          >
            {step.number}
          </span>
          <h3
            className="font-heading absolute left-[34.3%] w-[62%] -translate-y-1/2 text-[2.65vw] leading-none font-extrabold whitespace-nowrap text-black"
            style={{ top: `${processTitleTops[index]}%` }}
          >
            {processTitles[index]}
          </h3>
          <p
            className="absolute left-[52.5%] w-[41%] -translate-y-1/2 text-[clamp(0.67rem,2.72vw,1.28rem)] leading-[1.08] text-white"
            style={{ top: `${processDescriptionTops[index]}%` }}
          >
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
