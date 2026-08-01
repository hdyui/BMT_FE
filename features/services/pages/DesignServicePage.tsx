import Image from "next/image";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { TiltedPhotoStack } from "@/features/services/components/TiltedPhotoStack";
import { ProjectCarousel } from "@/features/services/components/ProjectCarousel";
import { SolutionCards } from "@/features/services/components/SolutionCards";
import { PillCtaButton } from "@/features/services/components/PillCtaButton";
import { ProcessTimeline } from "@/features/services/components/ProcessTimeline";
import {
  heroCards,
  featuredProjects,
  solutionCards,
} from "@/features/services/data/thiet-ke-kien-truc-noi-that";

export function DesignServicePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white pt-16 text-charcoal">
      <SiteHeader />

      <section className="relative isolate overflow-hidden">
        <Image
          className="absolute inset-y-0 left-0 -z-10 hidden h-full w-[46%] object-contain object-left opacity-80 lg:block"
          src="/images/thiet-ke-kien-truc-noi-that/hero-sketch.png"
          alt=""
          width={900}
          height={1100}
        />

        <div className="mx-auto grid w-[min(1200px,calc(100%-2.25rem))] items-center gap-10 py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-24">
          <div>
            <Reveal>
              <h1 className="text-3xl leading-tight font-normal text-brand sm:text-4xl">
                DỊCH VỤ THIẾT KẾ KIẾN TRÚC
                <br />& NỘI THẤT CHUYÊN NGHIỆP
              </h1>
            </Reveal>
            <BuildingRule
              className="mt-3 max-w-[280px]"
              src="/images/thiet-ke-kien-truc-noi-that/rule-dark.png"
            />
            <Reveal delay={160} from="left">
              <p className="mt-4 max-w-md text-sm leading-relaxed font-medium text-pretty">
                Kiến tạo không gian hài hòa giữa thẩm mỹ và công năng
              </p>
            </Reveal>
          </div>

          <Reveal from="right">
            <TiltedPhotoStack cards={heroCards} />
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-16">
        <Image
          className="-z-10 object-cover"
          src="/images/thiet-ke-kien-truc-noi-that/carousel-background.png"
          alt=""
          fill
          sizes="100vw"
        />

        <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))] text-center">
          <Reveal>
            <h2 className="text-3xl font-normal sm:text-4xl">
              GIẢI PHÁP THIẾT KẾ TỐI ƯU CHO MỌI KHÔNG GIAN
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-pretty">
              BMT Decor cung cấp dịch vụ thiết kế kiến trúc, thiết kế nội thất
              và giải pháp thiết kế đồng bộ cho nhà ở, văn phòng, showroom,
              spa, nhà hàng và khách sạn. Mỗi phương án đều được nghiên cứu kỹ
              lưỡng nhằm tối ưu công năng, ngân sách và giá trị sử dụng lâu
              dài.
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-5"
            src="/images/thiet-ke-kien-truc-noi-that/rule-orange.png"
          />
        </div>

        <Reveal className="mt-12" delay={120}>
          <ProjectCarousel projects={featuredProjects} />
        </Reveal>

        <Reveal className="mt-8 flex justify-center" delay={200}>
          <PillCtaButton
            className="w-[220px]"
            href="#contact-form"
            label="TƯ VẤN MIỄN PHÍ"
            image="/images/thiet-ke-kien-truc-noi-that/btn-pill.png"
            imageWidth={1539}
            imageHeight={292}
          />
        </Reveal>
      </section>

      <section className="bg-neutral-100 py-16">
        <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
          <div className="text-center">
            <Reveal>
              <h2 className="text-3xl font-normal sm:text-4xl">
                THIẾT KẾ NỘI THẤT THEO TỪNG LOẠI HÌNH CÔNG TRÌNH
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
                Giải pháp thiết kế tối ưu cho từng không gian
              </p>
            </Reveal>
            <BuildingRule
              className="mx-auto mt-5 mb-12"
              src="/images/thiet-ke-kien-truc-noi-that/rule-orange.png"
            />
          </div>

          <SolutionCards cards={solutionCards} />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto mb-14 w-[min(790px,calc(100%-2.25rem))] text-center">
          <Reveal>
            <h2 className="flex items-center justify-center gap-3 text-3xl font-normal sm:text-4xl">
              QUY TRÌNH THIẾT KẾ TẠI
              <Image
                className="inline-block h-7 w-auto sm:h-9"
                src="/images/thiet-ke-kien-truc-noi-that/icon-building.png"
                alt=""
                width={90}
                height={95}
              />
              BMT DECOR
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
