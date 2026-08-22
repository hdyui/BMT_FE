import Image from "next/image";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { DesignHeroGallery } from "@/features/services/components/DesignHeroGallery";
import { MobileHeroArtwork } from "@/features/services/components/MobileHeroArtwork";
import { ProjectCarousel } from "@/features/services/components/ProjectCarousel";
import { SolutionCards } from "@/features/services/components/SolutionCards";
import { PillCtaButton } from "@/features/services/components/PillCtaButton";
import { ProcessTimeline } from "@/features/services/components/ProcessTimeline";
import {
  SERVICE_HERO_CLASS_NAME,
  SERVICE_PROJECT_CAROUSEL_CLASS_NAME,
  SERVICE_PROJECT_CTA_CLASS_NAME,
  SERVICE_PROJECT_HEADING_CLASS_NAME,
  SERVICE_PROJECT_SECTION_CLASS_NAME,
  SERVICE_SOLUTION_CARDS_CLASS_NAME,
  SERVICE_SOLUTION_HEADING_CLASS_NAME,
  SERVICE_SOLUTION_SECTION_CLASS_NAME,
} from "@/features/services/config/layout";
import {
  featuredProjects,
  solutionCards,
} from "@/features/services/data/thiet-ke-kien-truc-noi-that";

export function DesignServicePage() {
  return (
    <div className="min-h-screen bg-white text-charcoal md:pt-16 xl:pt-[var(--site-header-desktop-height)]">
      <SiteHeader />

      {/* Dùng đúng token chung với các trang dịch vụ khác: chiều cao banner ăn
          theo 38.9vw nên tỉ lệ giữ nguyên ở mọi bề rộng màn hình và mọi mức
          zoom. Cụm ảnh bên phải scale theo chiều cao này. */}
      {/* `hero-artwork.png` là ảnh ghép sẵn cụm ảnh nghiêng, chỉ chừa ~37%
          chiều cao rỗng phía trên cho khối chữ. Mobile section cao hơn ảnh
          đúng 2.5rem (thay `aspect-[3884/5972]` bằng `calc(153.76vw+2.5rem)`,
          153.76vw = 5972/3884 quy đổi theo bề rộng), ảnh nhét trong khung con
          khớp đúng tỉ lệ gốc và neo đáy (`bottom-0`) — phần dư ra thành
          khoảng trắng thật ở đỉnh cho khối chữ `pt-32`, không đè lên ảnh. */}
      <section
        className={`${SERVICE_HERO_CLASS_NAME} max-md:!h-[calc(85px+140.16vw)] max-md:!min-h-0`}
      >
        <MobileHeroArtwork variant="design" />

        {/* Ảnh Nền Banner */}
        <Reveal className="absolute inset-0 -z-20 max-md:hidden" from="fade">
          <Image
            className="size-full object-cover"
            src="/images/thiet-ke-kien-truc-noi-that/background-banner.png" // <-- URL ẢNH NỀN BANNER
            alt=""
            fill
            sizes="100vw"
            priority
            aria-hidden="true"
          />
        </Reveal>

        {/* Bản vẽ wireframe nền trái. `object-contain` nên bề rộng thật của
            hình = 0.698 x chiều cao banner, KHÔNG phải w-[38%]. Kéo sang trái
            -8% để mép phải bản vẽ dừng ở ~19.6vw đúng như mockup, chừa khoảng
            trắng cho khối chữ thay vì để nét vẽ chạy xuyên qua chữ.

            Bản vẽ neo đáy (`bottom-0` + `object-left-bottom`) nên `-top-` vừa là
            núm phóng to vừa là núm nâng/hạ: giảm số thì bản vẽ vừa nhỏ lại vừa
            tụt xuống.

            File `hero-wireframe-original.png` có LỀ RỖNG: 2,9% ở đáy và 14,1% ở
            phải (đo trên file 2257x3235). Nên hai chỉnh dưới đây:
              - `-bottom-[1.25rem]`: khung tràn 20px xuống dưới đáy banner, vừa
                đúng phần lề rỗng, nhờ vậy NÉT VẼ chạm đáy banner thay vì hở.
              - `-left-[7%]`: nhích sang phải. Nét vẽ thật chỉ tới x=293px chứ
                không phải mép khung, nên vẫn chưa đụng chữ (chữ bắt đầu x=328px).
                Hai số `-top-` và `-left-` phải đi cùng nhau: thu nhỏ bản vẽ thì
                mép phải nét vẽ tự lùi trái, muốn giữ nguyên chỗ đó thì phải nhích
                `-left-` lên tương ứng. */}
        <Reveal
          className="absolute -top-[7%] -bottom-[1.25rem] -left-[5.5%] -z-10 hidden w-[46%] lg:block"
          delay={100}
          from="fade"
        >
          <Image
            className="size-full object-contain object-left-bottom opacity-80"
            src="/images/thiet-ke-kien-truc-noi-that/hero-wireframe-original.png"
            alt=""
            fill
            sizes="38vw"
            loading="eager"
            aria-hidden="true"
          />
        </Reveal>

        {/* Layout mới: Trái là Text (Max Width), Phải là Gallery bám sát viền */}
        {/* Màn nhỏ: chữ dồn lên trên, cụm ảnh nằm dưới -> không chồng lên nhau. */}
        {/* `lg:pt-24` khớp với mốc 96px của bản vẽ nền và cụm ảnh, để khối chữ
            canh giữa theo đúng vùng còn lại chứ không canh giữa cả banner. */}
        {/* `max-md:!pt-32` khớp khoảng cách header->tiêu đề chuẩn lấy từ
            RenovationMobileHero (~85px header + ~41px khoảng trắng riêng =
            ~128px), thay cho `pt-24` cũ (96px, chỉ chừa ~11px dưới header). */}
        <div className="absolute inset-x-0 top-[85px] bottom-0 z-10 md:hidden">
          <Reveal
            className="absolute top-[4.72vw] bottom-[75.5%] left-[6.55%] w-0.5"
            delay={90}
            from="fade"
          >
            <Image
              className="size-full object-fill"
              src="/images/thiet-ke-kien-truc-noi-that/hero-accent-line.png"
              alt=""
              fill
              sizes="2px"
              aria-hidden="true"
            />
          </Reveal>

          {/* `top-[5vw]` = đúng mốc của trang xây dựng trọn gói (khối overlay ở
              cả hai trang đều bắt đầu tại 85px, bên đó là 3,6% x 138,95vw =
              5,0vw). `w-` chỉ là mốc ngắt dòng chứ không dời chữ (tiêu đề canh
              trái, vạch và dòng mô tả nằm ở element riêng), nên nới 86% -> 89,5%
              để dòng "DỊCH VỤ THIẾT KẾ KIẾN TRÚC" ở cỡ mới không bị rớt dòng. */}
          <div className="absolute top-[5vw] left-[10.2%] w-[89.5%]">
            <Reveal>
              <h1 className="font-heading text-[clamp(1.1rem,5.9vw,1.75rem)] font-extrabold leading-[1.12] text-brand">
                DỊCH VỤ THIẾT KẾ KIẾN TRÚC
                <br />&amp; NỘI THẤT CHUYÊN NGHIỆP
              </h1>
            </Reveal>
          </div>

          <BuildingRule
            className="absolute top-[14.5%] left-[10.2%] h-[4.2%] w-[40%] max-w-none [&_img]:object-contain [&_img]:object-right"
            src="/images/services/rule-dark.png"
            delay={160}
          />

          <Reveal
            className="absolute top-[22%] left-[10.2%] flex items-center gap-[0.2em] text-[clamp(0.55rem,2.75vw,0.68rem)]"
            delay={280}
            from="left"
          >
            <Image
              className="relative -top-[0.12em] size-[1.1em] shrink-0 object-contain"
              src="/images/thiet-ke-kien-truc-noi-that/icon-building.png"
              alt=""
              width={160}
              height={169}
              aria-hidden="true"
            />
            <p className="whitespace-nowrap text-[clamp(0.55rem,2.75vw,0.68rem)] leading-relaxed">
              Kiến tạo không gian hài hòa giữa thẩm mỹ và công năng
            </p>
          </Reveal>
        </div>

        <div className="relative mx-auto hidden h-full w-full max-w-none items-start pt-14 md:flex lg:items-center lg:pt-24">
          {/* Cụm Text Bên Trái */}
          {/* Bề rộng khối chữ đi theo cỡ chữ (33vw ≈ 14.3 lần font-size) nên
              tiêu đề luôn ngắt đúng 2 dòng như mockup và mép phải dừng trước
              cụm ảnh nghiêng ở mọi bề rộng màn hình. Cỡ chữ tiêu đề đã tăng lên
              để đồng bộ với các trang dịch vụ khác (2.2rem thay vì 1.85rem cũ)
              nên công thức này được nhân lại theo đúng tỉ lệ (x1.19): 580->690,
              28vw->33vw, 40px->48px — giữ nguyên tỉ lệ 14.3 lần font-size. */}
          <div className="relative z-10 ml-4 w-full max-w-[500px] shrink-0 pl-4 pr-4 max-md:ml-8 max-md:max-w-[24.75rem] sm:ml-6 sm:pl-8 lg:ml-[20%] lg:max-w-[min(690px,calc(33vw_+_48px))] lg:pl-10 lg:pr-0">
            {" "}
            <Reveal
              className="absolute -top-5 -bottom-5 left-0 w-0.5 max-md:top-1 max-md:bottom-1 sm:w-1"
              delay={110}
              from="fade"
            >
              <Image
                className="size-full object-fill"
                src="/images/thiet-ke-kien-truc-noi-that/hero-accent-line.png"
                alt=""
                fill
                sizes="8px"
                aria-hidden="true"
              />
            </Reveal>
            <Reveal>
              {/* Mockup dùng cỡ chữ ~1.89vw; 2.15vw cũ làm tiêu đề tràn khỏi
                  khối chữ và đè lên bản vẽ nền. */}
              <h1 className="font-heading text-xl font-extrabold leading-[1.12] text-brand max-md:text-[clamp(1.35rem,5.25vw,1.55rem)] sm:text-[clamp(1.6rem,1.95vw,2.2rem)]">
                <span className="md:hidden">
                  DỊCH VỤ THIẾT KẾ KIẾN TRÚC
                  <br />&amp; NỘI THẤT CHUYÊN NGHIỆP
                </span>
                <span className="hidden md:inline">
                  DỊCH VỤ THIẾT KẾ KIẾN TRÚC&nbsp;&amp;
                  <br />
                  NỘI THẤT CHUYÊN NGHIỆP
                </span>
              </h1>
            </Reveal>
            <Reveal
              className="relative mt-4 h-[1.3rem] w-28 overflow-hidden"
              delay={180}
              from="fade"
            >
              <Image
                className="absolute top-0 right-0 w-56 max-w-none"
                src="/images/services/rule-dark.png"
                alt=""
                width={1388}
                height={128}
                aria-hidden="true"
              />
            </Reveal>
            <Reveal
              className="flex items-start gap-2 max-md:items-center"
              delay={300}
              from="left"
            >
              <Image
                className="mt-[0.7rem] hidden size-3 shrink-0 object-contain max-md:mt-0 max-md:block"
                src="/images/thiet-ke-kien-truc-noi-that/icon-building.png"
                alt=""
                width={160}
                height={169}
                aria-hidden="true"
              />
              <p className="mt-2 max-w-[250px] text-pretty text-sm font-normal leading-relaxed max-md:mt-0 max-md:max-w-none max-md:whitespace-nowrap max-md:text-[clamp(0.55rem,2.85vw,0.7rem)] sm:text-base">
                Kiến tạo không gian hài hòa giữa
                <br className="hidden sm:inline" /> thẩm mỹ và công năng
              </p>
            </Reveal>
          </div>

          {/* Cụm ảnh bên phải: tự dán sát mép phải và tự tính kích thước theo
              chiều cao banner (xem DesignHeroGallery). */}
          <DesignHeroGallery />
        </div>
      </section>

      {/* CÁC SECTION KHÁC BÊN DƯỚI GIỮ NGUYÊN NHƯ CŨ */}
      <section
        className={`${SERVICE_PROJECT_SECTION_CLASS_NAME} relative isolate !py-12 max-md:!pt-8 max-md:!pb-3 lg:!py-16`}
      >
        <Image
          className="-z-10 object-cover"
          src="/images/thiet-ke-kien-truc-noi-that/carousel-background.png"
          alt=""
          fill
          sizes="100vw"
        />

        <div
          className={`${SERVICE_PROJECT_HEADING_CLASS_NAME} !mb-8 px-4 text-center lg:!mb-10`}
        >
          <Reveal>
            <h2 className="font-heading text-center text-3xl font-extrabold leading-[1.08] max-md:text-[clamp(1.12rem,4.75vw,1.55rem)] sm:text-4xl">
              GIẢI PHÁP THIẾT KẾ TỐI ƯU CHO MỌI KHÔNG GIAN
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-3xl text-pretty text-justify [text-align-last:center] text-sm leading-relaxed max-md:text-[0.82rem] max-md:leading-[1.3]">
              BMT Decor cung cấp dịch vụ{" "}
              <strong className="font-bold">thiết kế kiến trúc</strong>,{" "}
              <strong className="font-bold">thiết kế nội thất</strong> và giải
              pháp thiết kế đồng bộ cho nhà ở, văn
              <br className="hidden lg:inline" /> phòng, showroom, spa, nhà hàng
              và khách sạn. Mỗi phương án đều được nghiên cứu kỹ lưỡng nhằm tối
              ưu công
              <br className="hidden lg:inline" /> năng, ngân sách và giá trị sử
              dụng lâu dài.
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-5 h-[clamp(1.25rem,4vw,2rem)] w-[45vw] max-w-none md:w-full md:max-w-62.5"
            src="/images/xay-dung-tron-goi/rule-orange.png"
            delay={300}
          />
        </div>

        <Reveal
          className={`${SERVICE_PROJECT_CAROUSEL_CLASS_NAME} w-full`}
          delay={120}
        >
          <ProjectCarousel
            projects={featuredProjects}
            prevIcon="/images/cai-tao-sua-chua/nav-prev.png"
            nextIcon="/images/cai-tao-sua-chua/nav-next.png"
            mobileMockup
          />
        </Reveal>

        <Reveal
          className={`${SERVICE_PROJECT_CTA_CLASS_NAME} !mt-8 max-md:!mt-3 flex w-full justify-center lg:!mt-12`}
          delay={200}
        >
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
            textClassName="!text-[clamp(0.8rem,3.2vw,1.25rem)] lg:!text-[24px]"
          />
        </Reveal>
      </section>

      <section
        id="solution-cards"
        className={`bg-white ${SERVICE_SOLUTION_SECTION_CLASS_NAME} max-md:!pt-7 max-md:!pb-8`}
      >
        <div className={`${SERVICE_SOLUTION_HEADING_CLASS_NAME} max-md:!mb-4`}>
          <div className="text-center md:mb-12">
            <Reveal from="bottom">
              {/* Mockup tách 2 dòng: dòng trên chữ thường, dòng dưới in đậm —
                  giống hệt 3 trang dịch vụ còn lại. */}
              <h2 className="font-heading text-[clamp(1.05rem,4.55vw,1.5rem)] leading-[1.12] uppercase md:text-4xl">
                <span className="font-normal">THIẾT KẾ NỘI THẤT</span>
                <br />
                <span className="font-extrabold">THEO TỪNG LOẠI HÌNH CÔNG TRÌNH</span>
              </h2>
            </Reveal>
            <Reveal delay={140} from="bottom">
              <p className="mx-auto mt-2 max-w-xl text-[clamp(0.72rem,2.9vw,0.86rem)] md:mt-4 md:text-sm md:leading-relaxed">
                Giải pháp thiết kế tối ưu cho từng không gian
              </p>
            </Reveal>
            <Reveal delay={250} from="left">
              <BuildingRule
                className="mx-auto mt-3 h-[clamp(1.25rem,4vw,2rem)] w-[45vw] max-w-none md:mt-5 md:w-full md:max-w-62.5"
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

      <section
        id="design-process"
        className="relative z-10 -mb-[2.342945vw] scroll-mt-16 rounded-br-[48px] bg-[#f4f4f5] pt-16 pb-[calc(4rem+2.342945vw)] max-md:pt-8 max-md:pb-[calc(2.5rem+2.342945vw)] lg:-mb-[2.57vw] lg:pb-[calc(4rem+2.57vw)]"
      >
        {/* Dưới md: đỉnh section 64px -> 32px và khoảng cách vạch cam -> khối 6
            bước 56px -> 24px, cho khớp mức 48px/28-32px của section cuối ở các
            trang dịch vụ khác. Ảnh khung `process-framework.png` không có lề
            rỗng nên toàn bộ khoảng trắng là do hai mốc này. */}
        <div className="mx-auto mb-14 w-[min(790px,calc(100%-2.25rem))] max-md:mb-6">
          <Reveal className="">
            <h2 className="hidden flex-wrap items-center justify-center gap-x-3 gap-y-2 text-4xl font-extrabold md:flex">
              <span className="mt-2.5">QUY TRÌNH THIẾT KẾ TẠI</span>
              <Image
                className="inline-block h-9 w-auto sm:h-10"
                src="/images/thiet-ke-kien-truc-noi-that/process-brand-logo.png"
                alt="BMT Decor"
                width={1196}
                height={207}
              />
            </h2>
            <h2 className="font-heading text-center text-[clamp(0.95rem,4.75vw,1.55rem)] leading-[1.08] font-extrabold md:hidden">
              <span className="block">QUY TRÌNH THIẾT KẾ</span>
              <span className="flex items-center justify-center gap-1">
                TẠI
                <Image
                  className="h-[1.28rem] w-auto"
                  src="/images/thiet-ke-kien-truc-noi-that/process-brand-logo.png"
                  alt="BMT Decor"
                  width={1196}
                  height={207}
                />
              </span>
            </h2>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-3 h-[clamp(1.25rem,4vw,2rem)] w-[45vw] max-w-none md:hidden"
            src="/images/thiet-ke-kien-truc-noi-that/rule-orange.png"
          />
        </div>

        <ProcessTimeline />
      </section>

      <ContactForm showTopNotch />
      {/* Mobile: nền contact form đã là cam nên vạch cam đầu footer thành thừa. */}
      <SiteFooter hideTopBorderOnMobile />
    </div>
  );
}
