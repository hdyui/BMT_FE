import Image from "next/image";
import { BuildingRule } from "@/shared/components/BuildingRule";
import { Reveal } from "@/shared/components/Reveal";
import { PillCtaButton } from "@/features/services/components/PillCtaButton";
import { ProjectCarousel } from "@/features/services/components/ProjectCarousel";
import {
  featuredProjects,
  processSteps,
  solutionCards,
} from "@/features/services/data/renovation";

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
      <Reveal className="absolute inset-0 -z-20" from="fade">
        <Image
          className="origin-bottom object-cover object-bottom animate-[hero-bg-drift_24s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
          src="/images/cai-tao-sua-chua/hero-background.png"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />
      </Reveal>
      <Reveal
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[72%] w-[54%]"
        delay={100}
        from="fade"
      >
        <Image
          className="size-full object-contain object-left-bottom opacity-70"
          src="/images/cai-tao-sua-chua/hero-wireframe.png"
          alt=""
          width={2721}
          height={3468}
          aria-hidden="true"
        />
      </Reveal>

      {/* Cỡ chữ/leading/hiệu ứng Reveal đồng bộ với banner thiết kế kiến trúc
          nội thất (DesignServicePage). Section này nằm ngay dưới header nhờ
          `pt-[60px]` của RenovationMobileContent, nên khoảng cách header ->
          tiêu đề chính là `top`: đặt `calc(25px + 5vw)` cho bằng trang xây dựng
          trọn gói (bên đó = 85px + 5vw tính từ đỉnh banner, trừ header 60px). */}
      <div className="absolute top-[calc(25px+5vw)] left-[7.3%] w-[83%] border-l-[3px] border-brand pl-[3.2%]">
        <Reveal>
          <h1 className="font-heading text-[clamp(1.1rem,5.9vw,1.75rem)] leading-[1.12] font-extrabold text-brand uppercase">
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
          <p className="mt-2 flex items-center gap-[0.2em] text-[clamp(0.55rem,2.85vw,0.7rem)] leading-relaxed text-charcoal">
            <Image
              className="relative -top-[0.12em] size-[1.1em] shrink-0 object-contain"
              src="/images/cai-tao-sua-chua/icon-house.png"
              alt=""
              width={90}
              height={95}
              aria-hidden="true"
            />
            Cải Tạo Không Gian - Nâng Tầm Giá Trị Công Trình
          </p>
        </Reveal>
      </div>

      {/* Bóng vuông bo góc, mờ mềm, nhô lên quá cạnh trên banner — nằm sau
          hoa văn chấm cam theo đúng mockup. */}
      <div
        className="pointer-events-none absolute -top-[4%] right-[9%] -z-10 h-[19%] w-[16%] rounded-[1.75rem] bg-charcoal/[0.035] blur-[1.2vw]"
        aria-hidden="true"
      />

      <Reveal
        className="absolute top-[20%] right-[7.5%] w-[7.2%]"
        delay={460}
        from="fade"
      >
        <Image
          className="h-auto w-full object-contain"
          src="/images/cai-tao-sua-chua/dots-pattern.png"
          alt=""
          width={288}
          height={480}
          aria-hidden="true"
        />
      </Reveal>

      <div className="absolute inset-x-[5.7%] bottom-[4.2%] grid h-[58.6%] grid-cols-2 grid-rows-[1.08fr_0.92fr] gap-[1.7%]">
        <Reveal className="group/frame relative overflow-hidden rounded-[clamp(1.25rem,5vw,2rem)] border-[3px] border-white shadow-[0_8px_18px_rgb(36_33_34/.14)]" delay={160} from="right">
          <Image
            className="object-cover"
            src="/images/cai-tao-sua-chua/hero-correct-top.png"
            alt="Phòng khách sau cải tạo"
            fill
            sizes="45vw"
          />
        </Reveal>
        <Reveal className="group/frame relative col-start-1 row-start-2 overflow-hidden rounded-[clamp(1.25rem,5vw,2rem)] border-[3px] border-white shadow-[0_8px_18px_rgb(36_33_34/.14)]" delay={320} from="right">
          <Image
            className="object-cover"
            src="/images/cai-tao-sua-chua/hero-correct-bottom.png"
            alt="Không gian phòng khách được cải tạo"
            fill
            sizes="45vw"
          />
        </Reveal>
        <Reveal className="group/frame relative col-start-2 row-span-2 row-start-1 overflow-hidden rounded-[clamp(1.25rem,5vw,2rem)] border-[3px] border-white shadow-[0_8px_18px_rgb(36_33_34/.14)]" delay={480} from="right">
          <Image
            className="object-cover"
            src="/images/cai-tao-sua-chua/hero-correct-large.png"
            alt="Mặt tiền nhà sau cải tạo"
            fill
            sizes="45vw"
          />
        </Reveal>
      </div>
    </section>
  );
}

function RenovationMobileProjects() {
  return (
    <section className="relative px-4 pt-8 pb-3">
      {/* Tiêu đề KHÔNG có lớp nền nào — ăn thẳng theo nền trắng của trang nên
          luôn trắng tinh 100%, không phụ thuộc vào chiều cao tổng của section
          (khác với dùng 1 gradient trải hết section, tỉ lệ trắng/xám sẽ đổi
          theo chiều cao carousel mỗi màn hình). */}
      <div className="mx-auto max-w-[29rem] text-center">
        <Reveal from="bottom">
          <h2 className="font-heading text-[clamp(1.12rem,4.75vw,1.55rem)] leading-[1.08] font-extrabold uppercase">
            Giải pháp cải tạo phù hợp cho
            <br /> mọi công trình
          </h2>
        </Reveal>
        <Reveal delay={100} from="bottom">
          <p className="mt-3 text-[clamp(0.7rem,2.75vw,0.82rem)] leading-[1.28] text-justify [text-align-last:center]">
            BMT Decor cung cấp dịch vụ cải tạo nhà ở, cải tạo văn phòng, cải tạo
            showroom, cải tạo nhà hàng, sửa chữa nhà và nâng cấp không gian theo
            nhu cầu thực tế, giúp khắc phục các hạng mục xuống cấp, tối ưu công
            năng và nâng cao giá trị sử dụng với chi phí hợp lý.
          </p>
        </Reveal>
        <BuildingRule
          className="mx-auto mt-5 h-[clamp(1.25rem,4vw,2rem)] w-[45vw] max-w-none md:w-full md:max-w-62.5"
          src="/images/xay-dung-tron-goi/rule-orange.png"
          delay={180}
        />
      </div>

      {/* Nền xám chỉ bọc riêng khối carousel + nút CTA. `-mx-4` bù trừ `px-4`
          của section để khối này (và ProjectCarousel bên trong) tràn
          full-bleed sát hai mép màn hình — nút mũi tên (left/right-[3.5%])
          của ProjectCarousel nhờ đó vẫn đo đúng từ mép thật thay vì lệch vào
          trong 16px mỗi bên. Dải gradient trắng→trong suốt cao 4rem ở đỉnh
          khối làm mềm ranh giới với phần tiêu đề phía trên thay vì cắt cứng. */}
      <div className="relative isolate -mx-4 mt-2 overflow-hidden bg-[#f2f2f3] pb-3">
        <div
          className="absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-white to-transparent"
          aria-hidden="true"
        />

        <Reveal delay={120} duration={850} from="bottom">
          <ProjectCarousel
            projects={mobileProjects}
            prevIcon="/images/cai-tao-sua-chua/nav-prev.png"
            nextIcon="/images/cai-tao-sua-chua/nav-next.png"
            mobileMockup
            mobileInitialIndex={0}
          />
        </Reveal>

        <Reveal className="mt-3 flex h-11 justify-center" delay={200} duration={800} from="bottom">
          <PillCtaButton
            className="h-full max-md:[&>span:first-child]:!h-[clamp(2rem,7vw,2.75rem)]"
            href="#contact-form"
            label="TƯ VẤN MIỄN PHÍ"
            image="/images/thi-cong-xay-dung/btn-pill.png"
            imageWidth={1539}
            imageHeight={292}
            mobileImage="/images/thi-cong-xay-dung/mobile/btn-consult.png"
            mobileImageWidth={1539}
            mobileImageHeight={292}
            mobileTextCentered
            textClassName="!text-[clamp(0.8rem,3.2vw,1.25rem)]"
          />
        </Reveal>
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
        <Reveal from="bottom">
          <h2 className="font-heading text-[clamp(1.05rem,4.55vw,1.5rem)] leading-[1.12] uppercase">
            <span className="font-normal">Cải tạo &amp; sửa chữa</span>
            <br />
            <span className="font-extrabold">theo từng loại hình công trình</span>
          </h2>
        </Reveal>
        <Reveal delay={140} from="bottom">
          <p className="mt-2 text-[clamp(0.72rem,2.9vw,0.86rem)]">
            Giải Pháp Cải Tạo Theo Từng Loại Hình Công Trình
          </p>
        </Reveal>
        <BuildingRule
          className="mx-auto mt-3 h-[clamp(1.25rem,4vw,2rem)] w-[45vw] max-w-none"
          src="/images/xay-dung-tron-goi/rule-orange.png"
          delay={120}
        />
      </div>

      <div className="mx-auto mt-4 grid max-w-[29rem] gap-4">
        {solutionCards.map((card, index) => {
          const layout = mobileTitleLayouts[index];

          return (
          <Reveal
            className="group/card overflow-hidden rounded-[clamp(1.4rem,6vw,2rem)] bg-white shadow-[0_4px_12px_rgb(36_33_34/.25)] transition-[transform,box-shadow] duration-300 ease-out active:-translate-y-1 active:shadow-[0_18px_36px_rgb(36_33_34/.18)]"
            delay={index * 90}
            duration={850}
            from="bottom"
            key={card.number}
          >
            <div className="relative aspect-[1.255] w-full overflow-hidden">
              <Image
                className="object-cover object-center transition-transform duration-500 ease-out group-active/card:scale-105"
                src={card.image}
                alt={card.titleCategory}
                fill
                sizes="calc(100vw - 2rem)"
              />
            </div>

            <Reveal
              className="px-[7.5%] pt-[5%] pb-[6%]"
              delay={index * 90 + 140}
              duration={750}
              from={index % 2 === 0 ? "right" : "left"}
            >
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
                href="/projects"
                label={card.cta}
                image={mobileSolutionCtas[index].image}
                imageWidth={mobileSolutionCtas[index].width}
                imageHeight={mobileSolutionCtas[index].height}
                textClassName="!text-[clamp(0.67rem,2.65vw,0.8rem)]"
                textPaddingRightPercent={10}
              />
            </Reveal>
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
    <Reveal
      className="group/step absolute left-0 h-[17.738%] w-full"
      delay={index * 90}
      duration={850}
      from="bottom"
      style={{ top: `calc(11.43% + ${index} * 17.738%)` }}
    >
      <div
        className={`absolute top-0 left-[12.2%] z-10 h-[77.18%] w-[67.1%] border-t border-l border-charcoal transition-[filter] duration-300 group-active/step:drop-shadow-[0_10px_18px_rgb(36_33_34/.24)] ${
          isLast ? "border-b" : ""
        }`}
      >
        <span className="absolute top-[-2px] left-[37.3%] h-[4px] w-[36.5%] rounded-full bg-brand shadow-[0_1px_1px_rgb(36_33_34/.25)]" />
        {!isLast && (
          <span className="absolute bottom-0 left-0 h-px w-[79.3%] bg-charcoal" />
        )}
      </div>

      {/* Mảng cam dưới số thứ tự: đổi sang cam nhạt khi rê/chạm. */}
      <div className="absolute top-[-3.36%] left-[10.5%] h-[83.9%] w-[10.7%] overflow-visible rounded-l-[14px] bg-brand transition-colors duration-300 group-active/step:bg-[#f8a976]">
        <span className="absolute top-1/2 right-[-20.5%] aspect-square w-[41%] -translate-y-1/2 rotate-45 bg-brand transition-colors duration-300 group-active/step:bg-[#f8a976]" />
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

      {/* Icon: xuất hiện sau cùng của bước, chỉ fade in. */}
      <Reveal
        className="absolute top-[24.16%] right-[10.1%] w-[10.8%]"
        delay={index * 90 + 320}
        from="fade"
      >
        <Image
          className="h-auto w-full object-contain"
          src={step.icon}
          alt=""
          width={199}
          height={188}
          aria-hidden="true"
        />
      </Reveal>

      {!isLast && (
        <span className="absolute top-[77.18%] left-[65.4%] h-[14.1%] w-px bg-charcoal" aria-hidden="true">
          <span className="absolute bottom-[-4px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-charcoal" />
        </span>
      )}
    </Reveal>
  );
}

function RenovationMobileProcess() {
  return (
    <section className="bg-[#f2f2f3]">
      <div className="relative mx-auto aspect-[410/840] w-full max-w-[410px] overflow-hidden bg-[#f2f2f3]">
        <Reveal className="absolute inset-x-0 top-[1.55%]" from="bottom">
          <h2 className="font-heading text-center text-[min(4.74vw,19.4px)] leading-[1.08] font-extrabold uppercase">
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
        </Reveal>

        {/* `top` 8,19% -> 7,4%: xích vạch lên sát tiêu đề thêm ~6,6px (khung
            cao 840 đơn vị nên 1% = 8,4px ở bề ngang tối đa 410px). Giảm tiếp
            nếu muốn sát hơn — vạch chỉ neo theo khung, không đẩy gì bên dưới. */}
        <Reveal
          className="absolute top-[7.4%] left-[27.5%] w-[45%]"
          delay={140}
          from="left"
        >
          <Image
            className="h-auto w-full object-contain"
            src="/images/xay-dung-tron-goi/rule-orange.png"
            alt=""
            width={1388}
            height={128}
            aria-hidden="true"
          />
        </Reveal>

        {processSteps.map((step, index) => (
          <MobileProcessStep step={step} index={index} key={step.number} />
        ))}
      </div>
    </section>
  );
}

export function RenovationMobileContent() {
  /* pt đúng bằng chiều cao header cố định (60px) để banner nằm sát ngay dưới
     header, không còn dải trắng thừa như mốc 85px cũ. */
  return (
    <main className="-mb-[2.342945vw] overflow-x-hidden pt-[60px] md:hidden">
      <RenovationMobileHero />
      <RenovationMobileProjects />
      <RenovationMobileSolutions />
      <RenovationMobileProcess />
    </main>
  );
}
