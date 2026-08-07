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

// Import Data
import {
  featuredProjects,
  solutionCards,
  processSteps,
} from "@/features/services/data/cai-tao-sua-chua";

export function RenovationServicePage() {
  return (
    <div className="min-h-screen  bg-white pt-16 text-charcoal">
      <SiteHeader />
      {/* SECTION 1: BANNER */}
      <section className={SERVICE_HERO_CLASS_NAME}>
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
        <div className="mx-auto grid h-full w-[min(1200px,calc(100%-2.25rem))] items-center gap-10 py-16 lg:grid-cols-[45%_55%] lg:gap-6 lg:py-10 xl:gap-8">
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
              `calc(100% - 345px)` để cụm chữ không bao giờ tràn sang cột ảnh
              khi màn hình hẹp. */}
          <div className="relative z-10 mt-32 flex flex-col justify-center pl-8 lg:mt-[150px] lg:pl-[min(calc(28vw_+_min(-1.125rem,600px_-_50vw)),calc(100%_-_345px))] xl:mt-[250px]">
            {/* Khối chứa thanh cam và Text */}
            <div className="relative mt-2 flex gap-5 sm:gap-6 xl:gap-7">
              {/* HOA VĂN CHẤM CAM: 
        Đã đổi từ -left sang -right để đưa sang góc trên bên phải của chữ */}
              <Reveal
                delay={520}
                from="fade"
                className="absolute -top-[60px] left-[100px] -z-10 lg:left-[100px] xl:-top-[170px] xl:left-[250px]"
              >
                <Image
                  className="w-[45px] object-contain xl:w-[50px]"
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
                  className="h-[170px] w-[4px] rounded-full object-cover sm:w-[5px] xl:h-[200px]"
                  src="/images/cai-tao-sua-chua/accent-tick.png"
                  alt=""
                  width={25}
                  height={1070}
                  aria-hidden="true"
                />
              </Reveal>

              {/* Khối Text */}
              <div className="flex flex-col justify-center lg:max-w-[clamp(210px,17vw,320px)]">
                {/* Tiêu đề */}
                <Reveal from="bottom">
                  <h1 className="text-2xl font-extrabold leading-[1.12] text-brand uppercase sm:text-[clamp(1.375rem,1.78vw,2.1rem)]">
                    DỊCH VỤ CẢI TẠO &
                    <br />
                    SỬA CHỮA TRỌN GÓI
                  </h1>
                </Reveal>

                {/* Đường line đen */}
                <Reveal delay={220} from="left">
                  <Image
                    className="mt-5 h-[16px] w-auto object-contain object-left xl:mt-6 xl:h-[20px]"
                    src="/images/cai-tao-sua-chua/icon-building-divider.png"
                    alt=""
                    width={571}
                    height={128}
                    aria-hidden="true"
                  />
                </Reveal>

                {/* Đoạn mô tả */}
                <Reveal delay={380} from="left">
                  <p className="mt-2 max-w-[310px] text-pretty text-sm font-normal leading-relaxed sm:text-base">
                    Cải Tạo Không Gian – Nâng Tầm
                    <br className="hidden sm:block" />
                    Giá Trị Công Trình
                  </p>
                </Reveal>
              </div>
            </div>
          </div>

          {/* CỤM 3 ẢNH BÊN PHẢI */}
          <div className="relative">
            {/* Khối trang trí nền: mảng bo tròn mờ nhô ra sau cụm ảnh */}
            <Reveal
              className="pointer-events-none absolute -top-6 -right-6 -bottom-10 -left-4 -z-10 hidden rounded-[48px] bg-black/[0.04] lg:block lg:-right-10 xl:-right-14"
              from="fade"
              delay={260}
            />

            <Reveal from="right">
              <RenovationHeroGallery
                large={{
                  image: "/images/cai-tao-sua-chua/hero-large.png",
                  alt: "Cải tạo mặt tiền nhà",
                }}
                top={{
                  image: "/images/cai-tao-sua-chua/hero-top.png",
                  alt: "Cải tạo phòng khách",
                }}
                bottom={{
                  image: "/images/cai-tao-sua-chua/hero-bottom.png",
                  alt: "Cải tạo không gian sống",
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 2: GIẢI PHÁP CẢI TẠO PHÙ HỢP CHO MỌI CÔNG TRÌNH */}
      <section className={SERVICE_PROJECT_SECTION_CLASS_NAME}>
        <div className={SERVICE_PROJECT_HEADING_CLASS_NAME}>
          <Reveal from="bottom">
            <h2 className="text-3xl font-bold uppercase sm:text-4xl">
              Giải Pháp Cải Tạo Phù Hợp Cho Mọi Công Trình
            </h2>
          </Reveal>
          <Reveal delay={140} from="bottom">
            <p className="mx-auto mt-6 max-w-[1180px] text-sm leading-relaxed text-pretty">
              BMT Decor cung cấp dịch vụ{" "}
              <strong className="font-bold">cải tạo nhà ở</strong>,{" "}
              <strong className="font-bold">cải tạo văn phòng</strong>,{" "}
              <strong className="font-bold">cải tạo showroom</strong>,{" "}
              <strong className="font-bold">cải tạo nhà hàng</strong>, sửa chữa
              nhà và nâng cấp không gian theo nhu cầu thực tế, giúp khắc phục
              các hạng mục xuống cấp, tối ưu công năng và nâng cao giá trị sử
              dụng với chi phí hợp lý.
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-5 h-8 max-w-[250px]"
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
            textClassName="!text-[24px]"
          />
        </Reveal>
      </section>

      {/* SECTION 3: THEO LOẠI HÌNH CÔNG TRÌNH */}
      <section
        className={`bg-neutral-100 ${SERVICE_SOLUTION_SECTION_CLASS_NAME}`}
      >
        <div className={SERVICE_SOLUTION_HEADING_CLASS_NAME}>
          <div className="mb-12 text-center">
            <Reveal from="bottom">
              <h2 className="text-3xl uppercase sm:text-4xl">
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
                className="mx-auto mt-5"
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
      <section className="py-16">
        {/* <div className="mx-auto mb-14 w-[min(790px,calc(100%-2.25rem))] text-center">
          <Reveal from="bottom">
            <h2 className="text-3xl font-bold uppercase sm:text-4xl">
              Quy Trình Cải Tạo & Sửa Chữa Tại BMT Decor
            </h2>
          </Reveal>
        </div> */}

        <RenovationProcessSteps steps={processSteps} />
      </section>

      <ContactForm />
      <SiteFooter />
    </div>
  );
}
