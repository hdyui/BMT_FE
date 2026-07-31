import Image from "next/image";
import Link from "next/link";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { FaqAccordion } from "@/features/services/components/FaqAccordion";
import { ProcessAccordion } from "@/features/services/components/ProcessAccordion";
import { services } from "@/config/site";

const deckImages = [
  ["/images/bmt-worksite.png", "Khảo sát nội thất", "object-[36%_center]"],
  ["/images/bmt-hero-interior.png", "Thiết kế nội thất", "object-[72%_center]"],
  ["/images/bmt-worksite.png", "Thi công công trình", "object-[10%_center]"],
  [
    "/images/bmt-faq-interior.png",
    "Hoàn thiện không gian",
    "object-[22%_center]",
  ],
] as const;

export function FullConstructionServicePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white pt-[86px] text-charcoal">
      <SiteHeader />

      <section className="relative isolate min-h-[760px] max-md:min-h-[900px]">
        <Image
          className="-z-30 object-cover"
          src="/images/bmt-hero-interior.png"
          alt="Không gian nội thất hiện đại do BMT Decor thiết kế"
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgb(255_255_255/.95)_0%,rgb(255_255_255/.78)_38%,rgb(255_255_255/.08)_68%)] max-md:bg-[linear-gradient(180deg,rgb(255_255_255/.96)_0%,rgb(255_255_255/.88)_55%,rgb(255_255_255/.18)_100%)]" />

        <div className="relative mx-auto min-h-[760px] w-[min(1640px,calc(100%-4rem))] max-md:min-h-[900px] max-md:w-[calc(100%-2.25rem)]">
          <Reveal
            className="relative z-10 w-[46%] max-w-[720px] pt-48 max-md:w-full max-md:pt-16"
            from="left"
          >
            <p className="mb-5 inline-block border-b-2 border-charcoal pb-2 text-xl">
              GIẢI PHÁP
            </p>
            <h1 className="max-w-[520px] text-[clamp(2rem,2.2vw,2.75rem)] leading-[1.18] font-normal text-brand">
              THIẾT KẾ THI CÔNG, XÂY DỰNG VÀ CẢI TẠO TRỌN GÓI
            </h1>
            <BuildingRule className="mt-2" />
            <h2 className="mt-6 mb-5 max-w-[500px] text-lg font-medium">
              ĐÁP ỨNG ĐA DẠNG NHU CẦU CHO NHÀ Ở VÀ CÔNG TRÌNH THƯƠNG MẠI
            </h2>
            <p className="max-w-[500px] text-base leading-relaxed">
              <span className="mr-1 text-xl text-brand" aria-hidden="true">
                ⌂
              </span>
              BMT Decor mang đến dịch vụ thiết kế thi công, xây dựng và cải tạo
              trọn gói từ ý tưởng đến hoàn thiện, tạo nên những công trình chất
              lượng và đáp ứng nhu cầu sử dụng.
            </p>
          </Reveal>

          <div className="absolute top-20 -right-8 h-[620px] w-[56%] max-lg:origin-top-right max-lg:scale-[.82] max-md:top-auto max-md:-right-12 max-md:bottom-0 max-md:w-[680px] max-md:origin-bottom-right max-md:scale-[.66]">
            {deckImages.map(([src, alt, position], index) => (
              <Reveal
                className={[
                  "absolute h-[515px] w-[250px] overflow-hidden rounded-[30px] border-[8px] border-white bg-neutral-200 shadow-[10px_13px_10px_rgb(27_25_25/.35)]",
                  index === 0 && "top-[118px] left-0 z-40",
                  index === 1 && "top-[72px] left-[24%] z-30",
                  index === 2 && "top-8 left-[49%] z-20",
                  index === 3 && "top-0 right-0 z-10",
                ]
                  .filter(Boolean)
                  .join(" ")}
                delay={index * 120}
                from="left"
                key={alt}
              >
                <Image
                  className={`object-cover ${position} transition-transform duration-500 hover:scale-105`}
                  src={src}
                  alt={alt}
                  fill
                  loading="eager"
                  sizes="250px"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 py-16">
        <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
          <nav
            className="grid border-b-4 border-neutral-300 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Các dịch vụ"
          >
            {services.map((service, index) => (
              <Link
                className={[
                  "relative px-3 py-4 text-center text-sm font-medium transition-colors hover:text-brand",
                  index === 0 &&
                    "after:absolute after:inset-x-0 after:-bottom-1 after:h-1 after:bg-brand",
                ]
                  .filter(Boolean)
                  .join(" ")}
                href={service.href}
                key={service.href}
              >
                {service.label.toUpperCase()}
              </Link>
            ))}
          </nav>

          <div className="grid items-center gap-12 pt-12 lg:grid-cols-2 lg:gap-20">
            <Reveal
              className="relative min-h-[405px] overflow-hidden rounded-[46px]"
              from="left"
            >
              <Image
                className="object-cover transition-transform duration-700 hover:scale-105"
                src="/images/bmt-worksite.png"
                alt="Đội ngũ BMT Decor kiểm tra thi công"
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
              />
            </Reveal>
            <Reveal className="max-w-[510px]" delay={140}>
              <span className="block text-7xl leading-none font-light text-neutral-400">
                01.
              </span>
              <h2 className="mt-3 text-4xl font-normal">XÂY DỰNG TRỌN GÓI</h2>
              <p className="mt-3 text-sm">
                KIẾN TẠO CÔNG TRÌNH BỀN VỮNG - TỪ THIẾT KẾ ĐẾN THI CÔNG
              </p>
              <span className="mt-5 mb-2 block h-0.5 w-36 bg-brand" />
              <p className="text-base leading-relaxed">
                Triển khai đồng bộ từ tư vấn, thiết kế đến thi công và bàn giao,
                giúp khách hàng kiểm soát tiến độ, tối ưu chi phí và đảm bảo
                chất lượng công trình trong từng giai đoạn.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20" id="quy-trinh">
        <Reveal className="mx-auto mb-10 w-[min(790px,calc(100%-2.25rem))] text-center">
          <h2 className="text-4xl font-normal md:text-[43px]">
            QUY TRÌNH LÀM VIỆC
          </h2>
          <p className="mx-auto mt-3 max-w-[720px] leading-relaxed">
            BMT Decor triển khai dự án theo quy trình 6 bước rõ ràng, đảm bảo
            tiến độ, chất lượng và đồng hành cùng khách hàng trong từng giai
            đoạn.
          </p>
          <BuildingRule className="mx-auto mt-4 max-w-[330px] text-brand" />
        </Reveal>
        <ProcessAccordion />
      </section>

      <section className="grid min-h-[730px] bg-brand lg:grid-cols-[1fr_1.05fr]">
        <div className="relative min-h-[440px] lg:min-h-[650px]">
          <Image
            className="object-cover"
            src="/images/bmt-faq-interior.png"
            alt="Góc nội thất thư giãn với tông màu kem"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="mt-[-44px] min-h-[650px] rounded-tr-[54px] bg-neutral-100 lg:mt-10 lg:rounded-tl-[72px] lg:rounded-tr-none">
          <Reveal
            className="mx-auto w-[min(610px,calc(100%-2.75rem))] py-14 lg:py-18"
            from="right"
          >
            <h2 className="text-4xl font-normal">CÁC CÂU HỎI THƯỜNG GẶP</h2>
            <p className="mt-4 max-w-[520px] leading-relaxed">
              Giải đáp những thắc mắc phổ biến giúp khách hàng hiểu rõ hơn về
              quy trình và dịch vụ của BMT Decor
            </p>
            <BuildingRule className="mt-4 mb-12 max-w-[330px] text-brand" />
            <FaqAccordion />
          </Reveal>
        </div>
      </section>

      <ContactForm />
      <SiteFooter />
    </div>
  );
}
