import Image from "next/image";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { PillCtaButton } from "@/features/services/components/PillCtaButton";
import { ProjectCarousel } from "@/features/services/components/ProjectCarousel";
import {
  featuredProjects,
  processSteps,
  solutionCards,
} from "@/features/services/data/cai-tao-sua-chua";

const mobileProjects = [
  featuredProjects[1],
  featuredProjects[0],
  featuredProjects[2],
] as const;

const mobileSolutionCtas = [
  {
    image: "/images/cai-tao-sua-chua/mobile/btn-pill-nha-o.png",
    width: 1668,
    height: 253,
  },
  {
    image: "/images/cai-tao-sua-chua/mobile/btn-pill-van-phong.png",
    width: 1978,
    height: 253,
  },
  {
    image: "/images/cai-tao-sua-chua/mobile/btn-pill-showroom.png",
    width: 2939,
    height: 253,
  },
  {
    image: "/images/cai-tao-sua-chua/mobile/btn-pill-nha-hang.png",
    width: 2682,
    height: 253,
  },
] as const;

function RenovationMobileHero() {
  return (
    <section className="relative isolate aspect-[932/1293] min-h-[34rem] overflow-hidden bg-[#f2f2f3]">
      <Image
        className="-z-20 object-cover object-bottom"
        src="/images/cai-tao-sua-chua/hero-background.png"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
      />
      <Image
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[72%] w-[54%] object-contain object-left-bottom opacity-70"
        src="/images/cai-tao-sua-chua/hero-wireframe.png"
        alt=""
        width={2721}
        height={3468}
        aria-hidden="true"
      />

      {/* Cỡ chữ/leading/hiệu ứng Reveal đồng bộ với banner thiết kế kiến trúc
          nội thất (DesignServicePage). Khoảng cách từ header xuống tiêu đề
          (top-[7.5%] cộng `pt-[85px]` của RenovationMobileContent) đã đủ rộng
          nên giữ nguyên. */}
      <div className="absolute top-[7.5%] left-[7.3%] w-[83%] border-l-[3px] border-brand pl-[3.2%]">
        <Reveal>
          <h1 className="font-heading text-[clamp(1.35rem,5.25vw,1.55rem)] leading-[1.12] font-extrabold text-brand uppercase">
            Dịch vụ cải tạo &amp;
            <br />
            sửa chữa trọn gói
          </h1>
        </Reveal>
        {/* KHÔNG override `h-` ở đây: `BuildingRule` mặc định `h-10`, còn ảnh
            bên trong dùng `fill` (position: absolute) nên không tự sinh chiều
            cao — trước đây truyền `h-auto` làm khung cao 0px, bị `overflow-hidden`
            cắt mất luôn, khiến vệt đen kèm icon nhà (logo đen ở đuôi vệt) biến
            mất hoàn toàn dù component vẫn "render". */}
        <BuildingRule
          className="mt-2 w-[45%]"
          src="/images/services/rule-dark.png"
          delay={120}
        />
        <Reveal delay={300} from="left">
          <p className="mt-2 text-[clamp(0.55rem,2.85vw,0.7rem)] leading-relaxed text-charcoal">
            Cải Tạo Không Gian - Nâng Tầm Giá Trị Công Trình
          </p>
        </Reveal>
      </div>

      <Image
        className="absolute top-[20%] right-[7.5%] h-auto w-[7.2%] object-contain"
        src="/images/cai-tao-sua-chua/dots-pattern.png"
        alt=""
        width={288}
        height={480}
        aria-hidden="true"
      />

      <div className="absolute inset-x-[5.7%] bottom-[4.2%] grid h-[58.6%] grid-cols-2 grid-rows-[1.08fr_0.92fr] gap-[1.7%]">
        <div className="relative overflow-hidden rounded-[clamp(1.25rem,5vw,2rem)] border-[3px] border-white shadow-[0_8px_18px_rgb(36_33_34/.14)]">
          <Image
            className="object-cover"
            src="/images/cai-tao-sua-chua/hero-correct-top.png"
            alt="Phòng khách sau cải tạo"
            fill
            sizes="45vw"
          />
        </div>
        <div className="relative col-start-1 row-start-2 overflow-hidden rounded-[clamp(1.25rem,5vw,2rem)] border-[3px] border-white shadow-[0_8px_18px_rgb(36_33_34/.14)]">
          <Image
            className="object-cover"
            src="/images/cai-tao-sua-chua/hero-correct-bottom.png"
            alt="Không gian phòng khách được cải tạo"
            fill
            sizes="45vw"
          />
        </div>
        <div className="relative col-start-2 row-span-2 row-start-1 overflow-hidden rounded-[clamp(1.25rem,5vw,2rem)] border-[3px] border-white shadow-[0_8px_18px_rgb(36_33_34/.14)]">
          <Image
            className="object-cover"
            src="/images/cai-tao-sua-chua/hero-correct-large.png"
            alt="Mặt tiền nhà sau cải tạo"
            fill
            sizes="45vw"
          />
        </div>
      </div>
    </section>
  );
}

function RenovationMobileProjects() {
  return (
    <section className="relative isolate overflow-hidden px-4 pt-8 pb-7">
      <Image
        className="-z-10 object-cover object-bottom opacity-55"
        src="/images/home/blueprint-background.png"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-[29rem] text-center">
        <Reveal from="bottom">
          <h2 className="font-heading text-[clamp(1.12rem,4.75vw,1.55rem)] leading-[1.08] font-extrabold uppercase">
            Giải pháp cải tạo phù hợp cho
            <br /> mọi công trình
          </h2>
        </Reveal>
        <Reveal delay={100} from="bottom">
          <p className="mt-3 text-[clamp(0.7rem,2.75vw,0.82rem)] leading-[1.28]">
            BMT Decor cung cấp dịch vụ cải tạo nhà ở, cải tạo văn phòng, cải tạo
            showroom, cải tạo nhà hàng, sửa chữa nhà và nâng cấp không gian theo
            nhu cầu thực tế, giúp khắc phục các hạng mục xuống cấp, tối ưu công
            năng và nâng cao giá trị sử dụng với chi phí hợp lý.
          </p>
        </Reveal>
        <BuildingRule
          className="mx-auto mt-3 h-auto w-[43%]"
          src="/images/xay-dung-tron-goi/rule-orange.png"
          delay={180}
        />
      </div>

      <div className="mt-2">
        <ProjectCarousel
          projects={mobileProjects}
          prevIcon="/images/cai-tao-sua-chua/nav-prev.png"
          nextIcon="/images/cai-tao-sua-chua/nav-next.png"
          mobileMockup
          mobileInitialIndex={0}
        />
      </div>

      <div className="mt-4 flex h-9 justify-center">
        <PillCtaButton
          className="h-full"
          href="#contact-form"
          label="TƯ VẤN MIỄN PHÍ"
          image="/images/thi-cong-xay-dung/btn-pill.png"
          imageWidth={1539}
          imageHeight={292}
          textClassName="!text-[clamp(0.72rem,3.1vw,0.9rem)]"
        />
      </div>
    </section>
  );
}

// Toạ độ ngắt dòng riêng cho tiêu đề card mobile — `titlePrefix`/`titleCategory`
// gốc để xuống hàng tự nhiên theo bề rộng cột, làm chữ "VIỆN" (card 03) mồ côi
// một mình một hàng và "CẢI TẠO" (card 04) tách xa khỏi "NHÀ HÀNG &". Định
// nghĩa lại đúng điểm ngắt mong muốn cho từng card, mỗi dòng `whitespace-nowrap`
// để không bị trình duyệt tự bẻ thêm.
const mobileTitleLayouts = [
  { line1: "CẢI TẠO & SỬA CHỮA", line2: "NHÀ Ở" },
  { line1: "CẢI TẠO", line2: "VĂN PHÒNG" },
  { line1: "CẢI TẠO", line1Accent: "SHOWROOM &", line2: "THẨM MỸ VIỆN" },
  { line1: "CẢI TẠO", line1Accent: "NHÀ HÀNG &", line2: "KHÁCH SẠN" },
] as const;

function RenovationMobileSolutions() {
  return (
    // `bg-white` (không phải `bg-[#f4f4f4]`) để tách bạch khỏi
    // RenovationMobileProcess ngay bên dưới (`bg-[#f2f2f3]`) — hai mã màu cũ
    // #f4f4f4/#f2f2f3 chỉ lệch 2/255 mỗi kênh, mắt thường không phân biệt
    // được nên hai section trông như dính liền, cùng một nền xám.
    <section className="bg-white px-4 pt-7 pb-8">
      <div className="mx-auto max-w-[29rem] text-center">
        <h2 className="font-heading text-[clamp(1.05rem,4.55vw,1.5rem)] leading-[1.12] uppercase">
          <span className="font-normal">Cải tạo &amp; sửa chữa</span>
          <br />
          <span className="font-extrabold">theo từng loại hình công trình</span>
        </h2>
        <p className="mt-2 text-[clamp(0.72rem,2.9vw,0.86rem)]">
          Giải Pháp Cải Tạo Theo Từng Loại Hình Công Trình
        </p>
        <BuildingRule
          className="mx-auto mt-3 h-auto w-[43%]"
          src="/images/xay-dung-tron-goi/rule-orange.png"
          delay={120}
        />
      </div>

      <div className="mx-auto mt-4 grid max-w-[29rem] gap-4">
        {solutionCards.map((card, index) => {
          const layout = mobileTitleLayouts[index];

          return (
          <Reveal
            className="overflow-hidden rounded-[clamp(1.4rem,6vw,2rem)] bg-white shadow-[0_4px_12px_rgb(36_33_34/.25)]"
            delay={index * 90}
            from="fade"
            key={card.number}
          >
            <div className="relative aspect-[1.255] w-full overflow-hidden">
              <Image
                className="object-cover"
                src={card.image}
                alt={card.titleCategory}
                fill
                sizes="calc(100vw - 2rem)"
              />
            </div>

            <div className="px-[7.5%] pt-[5%] pb-[6%]">
              <div className="flex min-w-0 items-start gap-[4%]">
                <span className="shrink-0 text-[clamp(2.95rem,13vw,4.35rem)] leading-[0.9] font-extrabold text-[#b8babc]">
                  {card.number}.
                </span>
                <h3 className="font-heading min-w-0 pt-[1%] text-[clamp(1.05rem,4.7vw,1.45rem)] leading-[1.3] font-extrabold whitespace-nowrap uppercase">
                  <span className="text-charcoal">{layout.line1}</span>
                  {"line1Accent" in layout ? (
                    <span className="text-brand"> {layout.line1Accent}</span>
                  ) : null}
                  <br />
                  <span className="text-brand">{layout.line2}</span>
                </h3>
              </div>

              <p className="mt-2 text-[clamp(0.72rem,3vw,0.88rem)] leading-tight font-extrabold">
                {card.tagline}
              </p>
              <span className="mt-2.5 mb-3 block h-0.5 w-[26%] bg-brand" />
              <p className="text-justify text-[clamp(0.69rem,2.72vw,0.82rem)] leading-[1.22]">
                {card.description}
              </p>
              <p className="mt-2 text-[clamp(0.7rem,2.85vw,0.84rem)] font-extrabold">
                BMT Decor cung cấp:
              </p>
              <ul className="mt-1 grid gap-0.5">
                {card.checklist.map((item) => (
                  <li
                    className="flex items-start gap-2 text-[clamp(0.69rem,2.72vw,0.82rem)] leading-[1.2]"
                    key={item}
                  >
                    <Image
                      className="mt-px size-[clamp(0.7rem,3vw,0.9rem)] shrink-0 object-contain"
                      src="/images/cai-tao-sua-chua/icon-house.png"
                      alt=""
                      width={90}
                      height={95}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <PillCtaButton
                className="mt-4 h-[clamp(1.6rem,6.5vw,2.05rem)] max-w-full"
                href="/du-an"
                label={card.cta}
                image={mobileSolutionCtas[index].image}
                imageWidth={mobileSolutionCtas[index].width}
                imageHeight={mobileSolutionCtas[index].height}
                textClassName="!text-[clamp(0.67rem,2.65vw,0.8rem)]"
                textPaddingRightPercent={10}
              />
            </div>
          </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function MobileProcessStep({
  step,
  index,
}: {
  step: (typeof processSteps)[number];
  index: number;
}) {
  const isLast = index === processSteps.length - 1;

  return (
    <div
      className="absolute left-0 h-[17.738%] w-full"
      style={{ top: `calc(11.43% + ${index} * 17.738%)` }}
    >
      <div
        className={`absolute top-0 left-[12.2%] z-10 h-[77.18%] w-[67.1%] border-t border-l border-charcoal ${
          isLast ? "border-b" : ""
        }`}
      >
        <span className="absolute top-[-2px] left-[37.3%] h-[4px] w-[36.5%] rounded-full bg-brand shadow-[0_1px_1px_rgb(36_33_34/.25)]" />
        {!isLast && (
          <span className="absolute bottom-0 left-0 h-px w-[79.3%] bg-charcoal" />
        )}
      </div>

      <div className="absolute top-[-3.36%] left-[10.5%] h-[83.9%] w-[10.7%] overflow-visible rounded-l-[14px] bg-brand">
        <span className="absolute top-1/2 right-[-20.5%] aspect-square w-[41%] -translate-y-1/2 rotate-45 bg-brand" />
        <span className="absolute inset-0 overflow-hidden rounded-l-[14px]">
          <span className="absolute inset-0 bg-[linear-gradient(58deg,rgb(255_255_255/.13)_0_49%,transparent_49.5%)]" />
        </span>
        {/* `translate-x-[14.5%]` bù cho mẩu kim cương chìa ra bên phải
            (`right-[-20.5%] w-[41%] rotate-45` ở trên): mẩu đó vẽ thêm phần
            hình từ 71% đến 129% bề rộng khối (tính theo % bề rộng khối chữ
            nhật), nên hình tổng (chữ nhật + mẩu nhọn) có tâm thật ở 64,5%
            thay vì 50%. Không dời số thì số bị lệch trái so với cả khối. */}
        <span className="absolute inset-0 grid translate-x-[14.5%] place-items-center text-[min(6.1vw,25px)] leading-none font-extrabold text-white">
          {step.number}
        </span>
      </div>

      <div className="absolute top-[16.78%] left-[25%] w-[50.5%]">
        <h3 className="font-heading text-[min(3.05vw,12.5px)] leading-none font-extrabold whitespace-nowrap">
          {step.title} {step.subtitle}
        </h3>
        <span className="mt-[3%] mb-[3%] block h-px w-[20.8%] bg-brand" />
        <p className="max-w-[97%] text-[min(2.63vw,10.8px)] leading-[1.13]">
          {step.description}
        </p>
      </div>

      <Image
        className="absolute top-[24.16%] right-[10.1%] h-auto w-[10.8%] object-contain"
        src={step.icon}
        alt=""
        width={199}
        height={188}
        aria-hidden="true"
      />

      {!isLast && (
        <span className="absolute top-[77.18%] left-[65.4%] h-[14.1%] w-px bg-charcoal" aria-hidden="true">
          <span className="absolute bottom-[-4px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-charcoal" />
        </span>
      )}
    </div>
  );
}

function RenovationMobileProcess() {
  return (
    <section className="bg-[#f2f2f3]">
      <div className="relative mx-auto aspect-[410/840] w-full max-w-[410px] overflow-hidden bg-[#f2f2f3]">
        <h2 className="font-heading absolute inset-x-0 top-[1.07%] text-center text-[min(4.35vw,17.8px)] leading-[1.08] font-extrabold uppercase">
          Quy trình cải tạo &amp; sửa chữa
          <span className="mt-[0.1%] flex items-center justify-center gap-[0.8%]">
            Tại
            <Image
              className="h-auto w-[24.4%] object-contain"
              src="/images/cai-tao-sua-chua/logo.png"
              alt="BMT Decor"
              width={1196}
              height={207}
            />
          </span>
        </h2>

        <Image
          className="absolute top-[8.69%] left-[32.2%] h-auto w-[35.6%] object-contain"
          src="/images/xay-dung-tron-goi/rule-orange.png"
          alt=""
          width={1388}
          height={128}
          aria-hidden="true"
        />

        {processSteps.map((step, index) => (
          <MobileProcessStep step={step} index={index} key={step.number} />
        ))}
      </div>
    </section>
  );
}

export function RenovationMobileContent() {
  return (
    <main className="overflow-x-hidden pt-[85px] md:hidden">
      <RenovationMobileHero />
      <RenovationMobileProjects />
      <RenovationMobileSolutions />
      <RenovationMobileProcess />
    </main>
  );
}
