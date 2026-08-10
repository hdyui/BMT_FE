import Image from "next/image";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { FaqAccordion } from "@/features/services/components/FaqAccordion";
import { ProcessAccordion } from "@/features/services/components/ProcessAccordion";
import { ServiceTabs } from "@/features/services/components/ServiceTabs";
import { heroCards } from "@/features/services/data/overview";
import { SERVICE_HERO_CLASS_NAME } from "@/features/services/config/layout";

const cardPositions = [
  "top-[16%] left-0 z-40",
  "top-[10.7%] left-[23.5%] z-30",
  "top-[5.35%] left-[47%] z-20",
  "top-0 left-[70.5%] z-10",
] as const;

export function ServicesOverviewPage() {
  return (
    <div className="min-h-screen bg-white text-charcoal">
      <SiteHeader />

      <section className={SERVICE_HERO_CLASS_NAME}>
        <Image
          className="-z-30 object-cover"
          src="/images/services/hero-background.webp"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgb(255_255_255/.95)_0%,rgb(255_255_255/.78)_38%,rgb(255_255_255/.08)_68%)] max-md:bg-[linear-gradient(180deg,rgb(255_255_255/.96)_0%,rgb(255_255_255/.88)_55%,rgb(255_255_255/.18)_100%)]" />

        <div className="relative h-full w-full max-md:mx-auto max-md:w-[calc(100%-2.25rem)]">
          <div className="relative z-10 flex h-full w-[36%] max-w-160 flex-col justify-center lg:ml-[7.3%] lg:translate-y-[3.5vw] max-md:h-auto max-md:w-full max-md:translate-y-0 max-md:justify-start max-md:pt-16">
            <Reveal>
              <p className="mb-4 inline-block border-b-2 border-charcoal pb-1 text-base sm:text-lg">
                GIẢI PHÁP
              </p>
              <h1 className="font-heading max-w-120 text-[clamp(1.25rem,4.6vw,2.35rem)] leading-[1.18] font-bold text-brand lg:text-[clamp(1.5rem,1.9vw,2.35rem)]">
                <span className="block lg:whitespace-nowrap">
                  THIẾT KẾ THI CÔNG, XÂY DỰNG VÀ
                </span>

                <span className="block lg:whitespace-nowrap">
                  CẢI TẠO TRỌN GÓI
                </span>
              </h1>
            </Reveal>

            <BuildingRule
              className="mt-2 w-full max-w-85"
              src="/images/services/rule-dark.png"
              delay={200}
            />

            <Reveal delay={320} from="left">
              <h2 className="font-heading mt-5 mb-4 max-w-160 text-sm sm:text-base">
                ĐÁP ỨNG ĐA DẠNG NHU CẦU CHO NHÀ Ở VÀ CÔNG TRÌNH THƯƠNG MẠI
              </h2>
              <span className="flex max-w-160 items-start gap-1.5 text-sm leading-relaxed text-pretty sm:text-base">
                <p className="leading-normal">
                  <Image
                    className="inline-block size-4 mr-0.5 my-1 align-sub object-contain"
                    src="/images/services/icon-house.png"
                    alt=""
                    width={86}
                    height={91}
                  />
                  BMT Decor mang đến dịch vụ thiết kế thi công, xây dựng và cải
                  tạo trọn gói từ ý tưởng đến hoàn thiện, tạo nên những công
                  trình chất lượng và đáp ứng nhu cầu sử dụng.
                </p>
              </span>
            </Reveal>
          </div>

          {/* Màn nhỏ: cụm thẻ neo góc dưới phải và rộng theo vw (thay cho
              680px + scale cứng cũ) nên không bao giờ tràn ngang.

              Từ md: `w-[45%]` (cũ 49%) + `top-[16.4%]` (cũ 9%). Cụm này lấy kích
              thước theo BỀ RỘNG rồi suy chiều cao qua `aspect-1387/1000`, nên
              giảm bề rộng là co đều cả hai chiều, không méo. Trước đây trang có
              `pt-16` đẩy banner xuống 64px; khi xoá khoảng trắng thì đỉnh cụm tụt
              lên y=50px, nằm sau SiteHeader (85px). Bộ số mới cho đỉnh cụm ở
              y≈92px (dưới header) mà đáy vẫn chạm đáy banner. */}
          <div className="absolute top-[16.4%] right-[7.2%] aspect-1387/1000 w-[45%] max-md:top-auto max-md:right-[-8%] max-md:bottom-0 max-md:w-[115%] max-md:origin-bottom-right">
            {heroCards.map((card, index) => (
              <Reveal
                className={`absolute w-[31.5%] hover:z-50 ${cardPositions[index]}`}
                delay={(heroCards.length - 1 - index) * 130}
                from="right"
                key={card.image}
              >
                <Image
                  className="h-auto w-full transition-transform duration-500 ease-out hover:scale-105"
                  src={card.image}
                  alt={card.alt}
                  width={800}
                  height={1501}
                  sizes="280px"
                  priority
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-[min(75rem,calc(100%-2.25rem))]">
          <ServiceTabs />
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20" id="quy-trinh">
        <div className="mx-auto mb-8 w-[min(49.375rem,calc(100%-2.25rem))] text-center lg:mb-10">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold sm:text-4xl md:text-[clamp(2.25rem,3.36vw,2.6875rem)]">
              QUY TRÌNH LÀM VIỆC
            </h2>
          </Reveal>
          <Reveal delay={160}>
            {/* Mockup ngắt 2 dòng sau "đảm bảo tiến độ," và in đậm "BMT Decor",
                "quy trình 6 bước". Ngắt dòng chỉ bật từ md trở lên để màn nhỏ
                vẫn tự xuống hàng theo bề rộng. */}
            <p className="mx-auto mt-3 max-w-180 text-sm leading-relaxed sm:text-base">
              <strong className="font-bold">BMT Decor</strong> triển khai dự án
              theo <strong className="font-bold">quy trình 6 bước</strong> rõ
              ràng, đảm bảo tiến độ,
              <br className="hidden md:inline" /> chất lượng và đồng hành cùng
              khách hàng trong từng giai đoạn.
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-4 w-full max-w-82.5"
            src="/images/services/rule-orange.png"
            delay={320}
          />
        </div>
        <ProcessAccordion />
      </section>

      {/* Ảnh trái chạm đáy section, panel xám lệch xuống 30px và thò qua phần
          liên hệ bên dưới. Phía trên đỉnh panel (bên phải đường cong của ảnh)
          để trắng, đúng bản thiết kế. Panel thụt sang trái 14px chui dưới ảnh
          để mép cong chạm đúng góc trên-trái của panel, không hở nêm trắng:
          14 = R - √(R² - (R - lệch)²) với R = 72, lệch = 30. */}
      {/* Ảnh trái và panel xám được đặt thẳng hàng để mép dưới khớp mượt mà. 
          Khe hở ở góc cong phía trên sẽ được lấp bằng một khối div phụ ẩn phía sau. */}
      <section className="grid lg:grid-cols-2">
        <Reveal
          className="relative mr-3.5 lg:mr-0 z-20 min-h-[clamp(12.5rem,45vw,17.5rem)] overflow-hidden rounded-tr-[clamp(2rem,7vw,3.375rem)] lg:min-h-120 lg:rounded-tr-[4.5rem]"
          from="left"
        >
          <Image
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            src="/images/services/faq-photo.webp"
            alt="Góc thư giãn trong công trình do BMT Decor thực hiện"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>

        {/* Đã xóa lg:-ml-[14px] ở div chứa panel */}
        <div className="relative z-10 bg-neutral-100 px-5 py-10 sm:py-14 lg:mt-7.5 lg:-mb-7.5 lg:rounded-tr-[5.1875rem] lg:rounded-bl-[1.875rem] lg:pt-8 lg:pr-[8%] lg:pb-12 lg:pl-[5.5%]">
          {/* MỚI: Khối màu xám nhỏ ẩn phía sau, dùng để lấp vào khoảng hở 14px ở góc trên cùng */}
          <div
            className="hidden lg:block absolute top-0 -left-3.5 w-3.5 h-25 bg-neutral-100"
            aria-hidden="true"
          />

          <Reveal>
            <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
              CÁC CÂU HỎI THƯỜNG GẶP
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 max-w-110 text-sm leading-relaxed text-pretty">
              Giải đáp những thắc mắc phổ biến giúp khách hàng hiểu rõ
              <br className="hidden md:inline" /> hơn về quy trình và dịch vụ
              của BMT Decor
            </p>
          </Reveal>
          <BuildingRule
            className="mt-3 mb-10 w-full max-w-82.5 lg:mb-18"
            src="/images/services/rule-orange.png"
            delay={320}
          />
          <FaqAccordion />
        </div>
      </section>

      {/* Panel FAQ đã thò xuống che sẵn nửa phải nên không cần dải nhô của form. */}
      <ContactForm topNotch={false} />
      <SiteFooter />
    </div>
  );
}
