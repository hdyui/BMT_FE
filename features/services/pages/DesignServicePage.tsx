import Image from "next/image";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { DesignHeroGallery } from "@/features/services/components/DesignHeroGallery";
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
    <div className="min-h-screen bg-white text-charcoal">
      <SiteHeader />

      {/* Dùng đúng token chung với các trang dịch vụ khác: chiều cao banner ăn
          theo 38.9vw nên tỉ lệ giữ nguyên ở mọi bề rộng màn hình và mọi mức
          zoom. Cụm ảnh bên phải scale theo chiều cao này. */}
      <section className={SERVICE_HERO_CLASS_NAME}>
        {/* Ảnh Nền Banner */}
        <Reveal className="absolute inset-0 -z-20" from="fade">
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
        <div className="relative mx-auto flex h-full w-full max-w-none items-start pt-14 lg:items-center lg:pt-24">
          {/* Cụm Text Bên Trái */}
          {/* Bề rộng khối chữ đi theo cỡ chữ (33vw ≈ 14.3 lần font-size) nên
              tiêu đề luôn ngắt đúng 2 dòng như mockup và mép phải dừng trước
              cụm ảnh nghiêng ở mọi bề rộng màn hình. Cỡ chữ tiêu đề đã tăng lên
              để đồng bộ với các trang dịch vụ khác (2.2rem thay vì 1.85rem cũ)
              nên công thức này được nhân lại theo đúng tỉ lệ (x1.19): 580->690,
              28vw->33vw, 40px->48px — giữ nguyên tỉ lệ 14.3 lần font-size. */}
          <div className="relative z-10 w-full max-w-[500px] shrink-0 pl-4 sm:pl-8 ml-4 sm:ml-6 lg:ml-[20%] lg:max-w-[min(690px,calc(33vw_+_48px))] lg:pl-10">
            {" "}
            <Reveal
              className="absolute -top-5 -bottom-5 left-0 w-0.5 sm:w-1"
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
              <h1 className="font-heading text-xl font-extrabold leading-[1.12] text-brand sm:text-[clamp(1.6rem,1.95vw,2.2rem)]">
                DỊCH VỤ THIẾT KẾ KIẾN TRÚC&nbsp;&
                <br />
                NỘI THẤT CHUYÊN NGHIỆP
              </h1>
            </Reveal>
            <Reveal
              className="mt-4 w-28"
              delay={180}
              from="left"
            >
              <Image
                className="h-auto w-full"
                src="/images/thiet-ke-kien-truc-noi-that/hero-title-rule.png"
                alt=""
                width={571}
                height={128}
                aria-hidden="true"
              />
            </Reveal>
            <Reveal delay={300} from="left">
              <p className="mt-2 max-w-[250px] text-pretty text-sm font-normal leading-relaxed sm:text-base">
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
        className={`${SERVICE_PROJECT_SECTION_CLASS_NAME} relative isolate !py-12 lg:!py-16`}
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
            <h2 className="font-heading text-center text-3xl font-bold sm:text-4xl">
              GIẢI PHÁP THIẾT KẾ TỐI ƯU CHO MỌI KHÔNG GIAN
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-3xl text-pretty text-center text-sm leading-relaxed">
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
            className="mx-auto mt-5 h-8 max-w-[250px]"
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
          />
        </Reveal>

        <Reveal
          className={`${SERVICE_PROJECT_CTA_CLASS_NAME} !mt-8 flex w-full justify-center lg:!mt-12`}
          delay={200}
        >
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

      <section
        className={`bg-neutral-100 ${SERVICE_SOLUTION_SECTION_CLASS_NAME}`}
      >
        <div className={SERVICE_SOLUTION_HEADING_CLASS_NAME}>
          <div className="text-center">
            <Reveal>
              {/* Mockup tách 2 dòng: dòng trên chữ thường, dòng dưới in đậm —
                  giống hệt 3 trang dịch vụ còn lại. */}
              <h2 className="font-heading text-3xl uppercase sm:text-4xl">
                <span className="font-normal">THIẾT KẾ NỘI THẤT</span>
                <br />
                <span className="font-bold">THEO TỪNG LOẠI HÌNH CÔNG TRÌNH</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
                Giải pháp thiết kế tối ưu cho từng không gian
              </p>
            </Reveal>
            <BuildingRule
              className="mx-auto mb-12 mt-5"
              src="/images/thiet-ke-kien-truc-noi-that/rule-orange.png"
            />
          </div>
        </div>

        <div className={SERVICE_SOLUTION_CARDS_CLASS_NAME}>
          <SolutionCards cards={solutionCards} />
        </div>
      </section>

      <section
        id="design-process"
        className="relative z-10 scroll-mt-16 rounded-br-[48px] bg-[#f4f4f5] py-16"
      >
        <div className="mx-auto mb-14 w-[min(790px,calc(100%-2.25rem))]">
          <Reveal className="">
            <h2 className="font-heading flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-4xl font-extrabold">
              <span className="mt-2.5">QUY TRÌNH THIẾT KẾ TẠI</span>
              <Image
                className="inline-block h-9 w-auto sm:h-10"
                src="/images/thiet-ke-kien-truc-noi-that/process-brand-logo.png"
                alt="BMT Decor"
                width={1196}
                height={207}
              />
            </h2>
          </Reveal>
        </div>

        <ProcessTimeline />
      </section>

      <ContactForm />
      <SiteFooter />
    </div>
  );
}
