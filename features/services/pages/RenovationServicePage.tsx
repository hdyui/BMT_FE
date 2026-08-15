import Image from "next/image";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ContactForm } from "@/lib/components/shared/ContactForm";

// Tái sử dụng components dùng chung
import { ProjectCarousel } from "@/features/services/components/ProjectCarousel";
import { SolutionCards } from "@/features/services/components/SolutionCards";
import { PillCtaButton } from "@/features/services/components/PillCtaButton";
import { RenovationHeroGallery } from "@/features/services/components/RenovationHeroGallery";
import { RenovationProcessSteps } from "@/features/services/components/RenovationProcessSteps";
import { RenovationMobileContent } from "@/features/services/components/RenovationMobileContent";
import {
  SERVICE_HERO_CLASS_NAME,
  SERVICE_PROJECT_CAROUSEL_CLASS_NAME,
  SERVICE_PROJECT_CTA_CLASS_NAME,
  SERVICE_PROJECT_HEADING_CLASS_NAME,
  SERVICE_PROJECT_SECTION_CLASS_NAME,
  SERVICE_SOLUTION_CARDS_CLASS_NAME,
  SERVICE_SOLUTION_HEADING_CLASS_NAME,
  SERVICE_SOLUTION_SECTION_CLASS_NAME,
  SERVICE_PILL_CTA_TEXT_CLASS_NAME,
} from "@/features/services/config/layout";

// Import Data
import {
  featuredProjects,
  solutionCards,
  processSteps,
} from "@/features/services/data/cai-tao-sua-chua";

/**
 * Hai vệt bóng ở mép phải banner. Ảnh nền `hero-background.png` (file -06) không
 * có sẵn hai vệt này nên phải dựng bằng CSS; toạ độ đo trên mockup -07
 * (8000x3468): vệt trên y 0%..48,6%, vệt dưới y 61,7%..100%, cả hai bám mép phải.
 * Góc bo chỉ ở phía trong (dưới-trái của vệt trên, trên-trái của vệt dưới) vì hai
 * đầu còn lại bị cạnh banner cắt.
 */
const EDGE_SHADOWS = [
  {
    key: "top",
    className:
      "top-0 h-[48.6%] rounded-bl-[2rem] animate-[hero-shadow-drift_13s_ease-in-out_infinite_alternate]",
  },
  {
    key: "bottom",
    // Thời lượng lẻ so với vệt trên (17s vs 13s) nên hai vệt không bao giờ trùng
    // pha; `-4s` cho nó vào giữa chu kỳ ngay khi tải, khỏi khởi động cùng lúc.
    className:
      "top-[61.7%] bottom-0 rounded-tl-[2rem] animate-[hero-shadow-drift_17s_ease-in-out_-4s_infinite_alternate]",
  },
] as const;

export function RenovationServicePage() {
  return (
    <div className="min-h-screen bg-white pt-16 text-charcoal xl:pt-[var(--site-header-desktop-height)]">
      <SiteHeader />
      <RenovationMobileContent />
      {/* SECTION 1: BANNER */}
      <section className={`${SERVICE_HERO_CLASS_NAME} max-md:hidden`}>
        {/* Ảnh nền do thiết kế cung cấp, đã có sẵn các vệt xám loang — dùng thẳng
            thay vì tự vẽ bóng bằng CSS. File gốc 8000x3468 (tỉ lệ 2.31) nhưng chỉ
            120KB vì là gradient trơn; `object-cover` cắt nhẹ hai bên cho khớp tỉ
            lệ banner (2.57). Next tự resize theo `sizes` nên không tải cả 8000px. */}
        {/* `object-bottom` + `origin-bottom`: ảnh tỉ lệ 2.31 còn banner 2.57 nên
            `object-cover` phải cắt 64px chiều cao. Mặc định nó cắt đều 32px trên
            và 32px dưới, ăn mất vệt bóng ở đáy ảnh — neo về đáy thì cắt trọn 64px
            ở trên, phần dưới hiện đủ. `origin-bottom` để animation phóng ảnh
            hướng lên, giữ mép đáy đứng yên, không thì vừa neo xong lại bị scale
            đẩy ra ngoài. */}
        <Image
          className="-z-20 origin-bottom object-cover object-bottom animate-[hero-bg-drift_24s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
          src="/images/cai-tao-sua-chua/hero-background.png"
          alt=""
          fill
          sizes="100vw"
          priority
          aria-hidden="true"
        />

        {/* Hai vệt bóng ở mép phải — ảnh nền -06 không có, đo trên mockup -07:
            dải loang ngang bắt đầu ở x=95,31%, đậm nhất 232 rồi nhạt dần về đúng
            màu nền 242 ở x=97,5%. Trên nền #F2F2F3 thì 232 tương đương đen 4,1%
            alpha, nên tô bằng gradient đen mờ dần thay vì màu xám đặc — cách này
            đúng cả khi ảnh nền phía dưới đổi màu.
            Vệt trên chạy từ đỉnh banner tới 48,6%; vệt dưới từ 61,7% tới đáy. */}
        {EDGE_SHADOWS.map((shadow) => (
          <div
            key={shadow.key}
            className={`pointer-events-none absolute right-0 -z-10 hidden w-[4.7%] bg-[linear-gradient(to_right,rgb(0_0_0/.042),transparent_47%)] motion-reduce:animate-none lg:block ${shadow.className}`}
            aria-hidden="true"
          />
        ))}

        {/* Bản phác thảo nhà, nền bên trái */}
        <Reveal
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[42%] lg:block"
          from="fade"
        >
          <Image
            className="object-contain object-left opacity-80"
            src="/images/cai-tao-sua-chua/hero-wireframe.png"
            alt=""
            fill
            sizes="42vw"
            priority
            aria-hidden="true"
          />
        </Reveal>

        {/* Lưới 45/55 */}
        <div className="mx-auto grid h-full w-[min(75rem,calc(100%-2.25rem))] items-center gap-8 py-10 sm:gap-10 sm:py-16 lg:grid-cols-[45%_55%] lg:gap-6 lg:py-10 xl:gap-8">
          {/* NỘI DUNG BÊN TRÁI

              Bản vẽ wireframe nền là `object-contain` nên bề rộng thật của nó
              bám theo CHIỀU CAO banner (~0.785 x chiều cao), tức là một tỉ lệ
              của viewport — trong khi lưới này nằm trong container đã bị chặn
              ở 1200px. Padding cố định vì thế trôi so với bản vẽ: ở 1440px cụm
              chữ rơi vào x≈17vw, ngay giữa vùng nét vẽ dày.

              Công thức dưới neo thanh cam ở ~22.6vw (đúng vị trí mockup) bằng
              cách trừ đi phần lề trái của container — viết dạng cộng với
              `min(-1.125rem, 600px - 50vw)` (tương đương trừ `max(...)`) để
              Tailwind không sinh ra `-1*max(...)`. Giá trị bị chặn bởi
              `calc(100% - 27rem)` để cụm chữ không bao giờ tràn sang cột ảnh
              khi màn hình hẹp — 27rem = thanh cam (0.25rem) + gap (tối đa
              1.75rem ở xl) + bề rộng tối đa của khối chữ (25rem, xem
              `lg:max-w-` bên dưới). Đổi bên này mà quên đổi
              `lg:max-w-` là tràn ngay, hai số phải đi cùng nhau. */}
          <div className="relative z-10 mt-16 flex translate-x-4 flex-col justify-center pl-4 sm:mt-32 sm:translate-x-6 sm:pl-8 lg:mt-[9.375rem] lg:translate-x-8 lg:pl-[min(calc(28vw+min(-1.125rem,37.5rem-50vw)),calc(100%-27rem))] xl:mt-[15.625rem] xl:translate-x-10">
            {/* Khối chứa thanh cam và Text */}
            <div className="relative mt-2 flex gap-5 sm:gap-6 xl:gap-7">
              {/* HOA VĂN CHẤM CAM: 
        Đã đổi từ -left sang -right để đưa sang góc trên bên phải của chữ */}
              <Reveal
                delay={520}
                from="fade"
                className="absolute top-[-2.5rem] left-[55%] -z-10 sm:top-[-3.75rem] sm:left-[6.25rem] lg:left-[6.25rem] xl:top-[-10.625rem] xl:left-[15.625rem]"
              >
                <Image
                  className="w-8 object-contain sm:w-[2.8125rem] xl:w-[3.125rem]"
                  src="/images/cai-tao-sua-chua/dots-pattern.png"
                  alt=""
                  width={288}
                  height={480}
                  aria-hidden="true"
                />
              </Reveal>

              {/* Thanh cam dọc */}
              <Reveal className="mt-1 shrink-0" from="fade">
                <Image
                  className="h-[7.5rem] w-0.5 rounded-full object-cover sm:h-[10.625rem] sm:w-1 xl:h-[12.5rem]"
                  src="/images/cai-tao-sua-chua/accent-tick.png"
                  alt=""
                  width={25}
                  height={1070}
                  aria-hidden="true"
                />
              </Reveal>

              {/* Khối Text

                  `lg:max-w-`: đo trực tiếp từ file font (OpenSans-ExtraBold)
                  dòng dài nhất "SỬA CHỮA TRỌN GÓI" rộng 10.807em. Ở cỡ chữ nhỏ
                  nhất lg (1.6rem) cần ~17.3rem, ở cỡ lớn nhất (2.2rem) cần
                  ~23.8rem — clamp(18.25rem,22vw,25rem) dưới đây luôn rộng hơn
                  mức cần một chút ở mọi bề rộng màn hình từ lg trở lên. Set
                  hẹp hơn (bản cũ 13.125rem-20rem) làm trình duyệt tự bẻ thêm
                  một dòng nữa dù đã có `<br/>`, tràn khỏi cụm thanh cam. */}
              <div className="flex flex-col justify-center lg:max-w-[clamp(18.25rem,22vw,25rem)]">
                {/* Tiêu đề. `whitespace-nowrap` để mỗi dòng KHÔNG tự bẻ thêm —
                    `<br/>` vẫn tách 2 dòng bình thường (không bị nowrap chặn),
                    đây chỉ là lưới an toàn cho đúng 2 dòng như mockup. */}
                <Reveal from="bottom">
                  <h1 className="font-heading text-xl font-extrabold leading-[1.12] text-brand uppercase whitespace-nowrap sm:text-[clamp(1.6rem,1.95vw,2.2rem)]">
                    DỊCH VỤ CẢI TẠO &
                    <br />
                    SỬA CHỮA TRỌN GÓI
                  </h1>
                </Reveal>

                {/* Đường line đen. mt-4 khớp với Construction/Design page (bản
                    cũ mt-5/xl:mt-6 khiến khoảng cách dòng to hơn 3 trang kia). */}
                <BuildingRule
                  className="mt-4 w-full max-w-85"
                  src="/images/services/rule-dark.png"
                  delay={220}
                />

                {/* Đoạn mô tả */}
                <Reveal delay={380} from="left">
                  <p className="mt-2 max-w-[19.375rem] text-pretty text-sm font-normal leading-relaxed sm:text-base">
                    Cải Tạo Không Gian – Nâng Tầm
                    <br className="hidden sm:block" />
                    Giá Trị Công Trình
                  </p>
                </Reveal>
              </div>
            </div>
          </div>

          {/* CỤM 3 ẢNH BÊN PHẢI

              Từ lg: neo từ trên xuống (`self-start` + `mt-[4.5625rem]`) thay vì
              canh giữa. Canh giữa làm đỉnh cụm rơi vào y=40px, tức nằm sau
              SiteHeader (85px) nên mép trên hai ảnh trái bị che.

              73px = 40px (`lg:py-10` của lưới) trừ đi rồi cộng: đỉnh cụm nằm ở
              y=113px, tức cách đáy header (85px) đúng 28px — bằng khoảng cách từ
              đáy cụm xuống đáy banner. Hai lề này cùng là px cố định nên bằng
              nhau ở mọi bề rộng. Chiều cao cụm đã trừ sẵn cả hai, xem
              RenovationHeroGallery. */}
          <div className="relative lg:mt-[4.5625rem] lg:self-start">
            <Reveal from="right">
              <RenovationHeroGallery
                large={{
                  image: "/images/cai-tao-sua-chua/hero-correct-large.png",
                  alt: "Mặt tiền nhà cải tạo với kiến trúc vòm",
                }}
                top={{
                  image: "/images/cai-tao-sua-chua/hero-correct-top.png",
                  alt: "Phòng khách cải tạo với nội thất hiện đại",
                }}
                bottom={{
                  image: "/images/cai-tao-sua-chua/hero-correct-bottom.png",
                  alt: "Không gian phòng khách sau cải tạo",
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 2: GIẢI PHÁP CẢI TẠO PHÙ HỢP CHO MỌI CÔNG TRÌNH */}
      <section className={`${SERVICE_PROJECT_SECTION_CLASS_NAME} max-md:hidden`}>
        <div className={SERVICE_PROJECT_HEADING_CLASS_NAME}>
          <Reveal from="bottom">
            <h2 className="font-heading text-3xl font-bold uppercase sm:text-4xl">
              Giải Pháp Cải Tạo Phù Hợp Cho Mọi Công Trình
            </h2>
          </Reveal>
          <Reveal delay={140} from="bottom">
            <p className="mx-auto mt-6 max-w-[73.75rem] text-sm leading-relaxed text-pretty text-justify [text-align-last:center]">
              BMT Decor cung cấp dịch vụ{" "}
              <strong className="font-bold">cải tạo nhà ở</strong>,{" "}
              <strong className="font-bold">cải tạo văn phòng</strong>,{" "}
              <strong className="font-bold">cải tạo showroom</strong>,{" "}
              <strong className="font-bold">cải tạo nhà hàng</strong>,{" "}
              <strong className="font-bold">
                sửa chữa
                <br className="hidden lg:inline" /> nhà
              </strong>{" "}
              và nâng cấp không gian theo nhu cầu thực tế, giúp khắc phục các
              hạng mục xuống cấp, tối ưu công năng và nâng
              <br className="hidden lg:inline" /> cao giá trị sử dụng với chi
              phí hợp lý.
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-5 h-[clamp(1.25rem,4vw,2rem)] w-[45vw] max-w-none md:w-full md:max-w-62.5"
            src="/images/xay-dung-tron-goi/rule-orange.png"
            delay={300}
          />
        </div>

        <Reveal className={SERVICE_PROJECT_CAROUSEL_CLASS_NAME} delay={120}>
          <ProjectCarousel
            projects={featuredProjects}
            prevIcon="/images/cai-tao-sua-chua/nav-prev.png"
            nextIcon="/images/cai-tao-sua-chua/nav-next.png"
          />
        </Reveal>

        <Reveal className={SERVICE_PROJECT_CTA_CLASS_NAME} delay={200}>
          <PillCtaButton
            className="h-full"
            href="#contact-form"
            label="TƯ VẤN MIỄN PHÍ"
            image="/images/thi-cong-xay-dung/btn-pill.png"
            imageWidth={1539}
            imageHeight={292}
            textClassName={SERVICE_PILL_CTA_TEXT_CLASS_NAME}
          />
        </Reveal>
      </section>

      {/* SECTION 3: THEO LOẠI HÌNH CÔNG TRÌNH. `bg-white` (không phải
          `bg-neutral-100`) để khớp đúng 2 trang Thi công/Xây dựng trọn gói —
          nền xám nhạt #f5f5f5 cũ gần như không phân biệt được với nền trắng
          #fff của SECTION 4 ngay bên dưới (section đó không set bg riêng nên
          ăn theo nền trắng của trang), khiến 2 section trông dính liền/trùng
          màu thay vì tách bạch. */}
      <section
        className={`bg-white ${SERVICE_SOLUTION_SECTION_CLASS_NAME} max-md:hidden`}
      >
        <div className={SERVICE_SOLUTION_HEADING_CLASS_NAME}>
          <div className="mb-12 text-center">
            <Reveal from="bottom">
              <h2 className="font-heading text-3xl uppercase sm:text-4xl">
                <span className="font-normal">CẢI TẠO & SỬA CHỮA</span>
                <br />
                <span className="font-bold">
                  THEO TỪNG LOẠI HÌNH CÔNG TRÌNH
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140} from="bottom">
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
                Giải Pháp Cải Tạo Theo Từng Loại Hình Công Trình
              </p>
            </Reveal>
            <Reveal delay={250} from="left">
              <BuildingRule
                className="mx-auto mt-3 h-auto w-[43%] max-md:aspect-1388/128 md:mt-5 md:w-auto"
                src="/images/cai-tao-sua-chua/rule-orange-center.png"
              />
            </Reveal>
          </div>
        </div>

        <div className={SERVICE_SOLUTION_CARDS_CLASS_NAME}>
          <SolutionCards
            cards={solutionCards}
            checkIcon="/images/cai-tao-sua-chua/icon-house.png"
            ruleImage="/images/cai-tao-sua-chua/rule-short.png"
          />
        </div>
      </section>

      {/* SECTION 4: QUY TRÌNH CẢI TẠO & SỬA CHỮA */}
      <section className="relative -mb-[2.342945vw] bg-white pt-16 pb-[calc(4rem+2.342945vw)] lg:-mb-[2.57vw] lg:pb-[calc(4rem+2.57vw)]">
        {/* <div className="mx-auto mb-14 w-[min(790px,calc(100%-2.25rem))] text-center">
          <Reveal from="bottom">
            <h2 className="font-heading text-3xl font-bold uppercase sm:text-4xl">
              Quy Trình Cải Tạo & Sửa Chữa Tại BMT Decor
            </h2>
          </Reveal>
        </div> */}

        <RenovationProcessSteps steps={processSteps} />
      </section>

      <ContactForm showTopNotch />
      <SiteFooter />
    </div>
  );
}
