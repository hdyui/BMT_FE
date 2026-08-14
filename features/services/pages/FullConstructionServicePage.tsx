import Image from "next/image";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { HexagonShowcase } from "@/features/services/components/HexagonShowcase";
import { MobileHeroArtwork } from "@/features/services/components/MobileHeroArtwork";
import { ProjectCarousel } from "@/features/services/components/ProjectCarousel";
import { SolutionCards } from "@/features/services/components/SolutionCards";
import { ProcessStepsGrid } from "@/features/services/components/ProcessStepsGrid";
import { PillCtaButton } from "@/features/services/components/PillCtaButton";
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
} from "@/features/services/data/xay-dung-tron-goi";

export function FullConstructionServicePage() {
  return (
    <div className="min-h-screen bg-white text-charcoal max-md:overflow-x-clip">
      <SiteHeader mobileServiceMockup />

      {/* `hero-artwork.png` là ảnh ghép sẵn cụm lục giác, chỉ chừa ~34,5%
          chiều cao rỗng phía trên cho khối chữ. Section cao hơn ảnh đúng
          2.5rem (`154vw` -> `calc(154vw+2.5rem)`), ảnh neo đáy (`bottom-0`
          thay cho `inset-0`) giữ nguyên kích thước gốc — phần dư ra thành
          khoảng trắng thật ở đỉnh cho khối chữ `pt-32`, không đè lên ảnh. */}
      <section
        className={`${SERVICE_HERO_CLASS_NAME} max-md:!h-[calc(85px+138.95vw)] max-md:!min-h-0 md:h-[55vw] md:min-h-0`}
      >
        <MobileHeroArtwork variant="full-construction" />

        {/* `pt-32` (128px) khớp khoảng cách header->tiêu đề chuẩn lấy từ
            RenovationMobileHero (~85px header + ~41px khoảng trắng riêng),
            thay cho `pt-[5.35rem]` cũ gần như sát luôn header không chừa
            khoảng trắng. */}
        <div className="absolute inset-x-0 top-[85px] bottom-0 z-10 md:hidden">
          <div className="absolute top-[5.4%] left-[10.5%] w-[86%]">
            <Reveal>
              <h1 className="font-heading text-[clamp(1.35rem,5.25vw,1.55rem)] font-extrabold leading-[1.12] text-brand">
                DỊCH VỤ THIẾT KẾ THI CÔNG
                <br />&amp; XÂY DỰNG TRỌN GÓI
              </h1>
            </Reveal>
            <BuildingRule
              className="mt-2 h-5 w-[42%] max-w-none [&_img]:object-contain [&_img]:object-right"
              src="/images/services/rule-dark.png"
              delay={160}
            />
            <Reveal delay={300} from="left">
              <p className="mt-2 flex items-center gap-2 text-[clamp(0.55rem,2.85vw,0.7rem)] leading-relaxed">
                <Image
                  className="size-3 shrink-0 object-contain"
                  src="/images/services/icon-house.png"
                  alt=""
                  width={90}
                  height={95}
                  aria-hidden="true"
                />
                <span>Kiến tạo công trình bền vững từ thiết kế đến thi công</span>
              </p>
            </Reveal>
          </div>
        </div>

        <Image
          className="absolute top-[9%] right-0 -z-10 hidden h-[91%] w-[18%] object-contain object-right-bottom opacity-90 md:block"
          src="/images/xay-dung-tron-goi/dong%20goi%20trang%20dich%20vu%20-%20xay%20dung%20tron%20goi%20web%20BMT%20decor-01.png"
          alt=""
          width={1680}
          height={3105}
          priority
        />

        <div className="mx-auto hidden w-[min(92%,47.5rem)] items-center gap-10 py-12 md:block md:h-full md:w-full md:max-w-none md:py-0">
          {/* BƯỚC 1 — scale giảm đều các cạnh.

              Trước đây kích thước cụm ăn theo BỀ RỘNG (`w-[55vw]` / clamp) nên
              chiều cao nó lớn hơn chiều cao banner, phải bù bằng `-top-[17.35%]`
              và bị cắt cả ở đỉnh (header 85px ăn thêm) lẫn ở đáy banner.

              Nay ngược lại: chiều cao ăn theo banner, bề rộng do
              `aspect-3467/4070` tự suy ra — co đều đúng tỉ lệ, không méo.

              Hai núm để chỉnh, không cần sửa gì khác:
                --hex-top   khoảng chừa ở đỉnh; GIẢM thì cụm to lên, tăng thì nhỏ
                            lại (nó bị trừ khỏi chiều cao nên đáy vẫn tự khớp).
                            Để ÂM thì cụm nhô lên quá cạnh trên banner và bị
                            `overflow-hidden` cắt ở đó — đó là cách làm 2 cạnh
                            đứng của ảnh TOP ngắn lại. Càng âm = ảnh top càng
                            ngắn và cả cụm càng to.
                --hex-bleed phần đáy cụm tràn xuống quá cạnh banner, bị
                            `overflow-hidden` của banner cắt đi. Núm này làm hai
                            việc cùng lúc: bịt khe hở ở đáy (file
                            `hero-cluster.png` có dải trong suốt ở mép dưới mà
                            `object-contain` vẫn tính vào khung) và làm 2 cạnh
                            đứng của ảnh bottom NGẮN lại, đồng thời cả cụm to lên.
                            Tăng số = cạnh ảnh bottom ngắn thêm. */}
          <div className="[--hex-bleed:2.75rem] [--hex-top:-4.5rem] md:absolute md:top-(--hex-top) md:left-0 md:aspect-3467/4070 md:h-[calc(100%-var(--hex-top)+var(--hex-bleed))] lg:left-[7.3%]">
            <HexagonShowcase />
          </div>

          {/* Thu nhỏ width phần content: md:w-[39%] -> md:w-[34%], lg:w-[32%] -> lg:w-[27%] để không đè lên hình phải */}
          <div className="md:absolute md:top-[24%] md:left-[58%] md:w-[40%] lg:top-[30.7%] lg:left-[max(52.3%,calc(7.3%+clamp(35rem,43.35vw,53.75rem)+1.5rem))] lg:w-[40%]">
            <div className="relative pl-6 sm:pl-8">
              <Reveal
                className="absolute -inset-y-2 left-0 w-0.5 sm:w-1"
                from="fade"
                delay={80}
              >
                <Image
                  className="h-full w-full object-fill"
                  src="/images/xay-dung-tron-goi/hero-bar.png"
                  alt=""
                  width={25}
                  height={1070}
                  aria-hidden="true"
                />
              </Reveal>

              <Reveal>
                <h1 className="font-heading text-xl font-extrabold leading-[1.12] text-brand sm:text-[clamp(1.6rem,1.95vw,2.2rem)]">
                  DỊCH VỤ THIẾT KẾ THI CÔNG
                  <br />& XÂY DỰNG TRỌN GÓI
                </h1>
              </Reveal>
              <BuildingRule
                className="mt-3 block mr-auto ml-0 w-full max-w-85"
                src="/images/services/rule-dark.png"
                delay={200}
              />
              <Reveal delay={320} from="left">
                <p className="mt-2 max-w-[19.375rem] text-pretty text-sm font-normal leading-relaxed sm:text-base">
                  Kiến tạo công trình bền vững từ
                  <br className="hidden sm:inline" /> thiết kế đến thi công
                </p>
              </Reveal>
            </div>

            {/* Chuyển ml-[59%] thành ml-[42%] để dấu chấm xích qua trái */}
            <Reveal
              className="mt-8 ml-[42%] w-12 lg:mt-12"
              from="fade"
              delay={460}
            >
              <Image
                className="h-auto w-full"
                src="/images/xay-dung-tron-goi/hero-dots.png"
                alt=""
                width={291}
                height={207}
                aria-hidden="true"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section
        className={`${SERVICE_PROJECT_SECTION_CLASS_NAME} relative isolate max-md:!pt-12 max-md:!pb-3 md:!py-12 lg:!py-16`}
      >
        <Image
          className="-z-10 object-cover"
          src="/images/xay-dung-tron-goi/carousel-background.png"
          alt=""
          fill
          sizes="100vw"
        />

        <div
          className={`${SERVICE_PROJECT_HEADING_CLASS_NAME} !mb-8 lg:!mb-10 text-center px-4`}
        >
          <Reveal>
            <h2 className="font-heading text-[clamp(1.12rem,4.75vw,1.55rem)] font-extrabold leading-[1.08] sm:text-3xl md:font-bold md:leading-normal lg:text-[2rem] text-center">
              TỐI ƯU MÔ HÌNH THIẾT KẾ
              <br />
              THI CÔNG TRỌN GÓI
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-center">
              Dịch vụ <span className="font-normal md:font-bold">thiết kế thi công</span> và{" "}
              <span className="font-normal md:font-bold">xây dựng trọn gói</span> giúp chủ đầu
              tư triển khai công trình một cách đồng bộ, từ ý tưởng,
              <br className="hidden lg:inline" /> thiết kế đến thi công hoàn
              thiện. Thay vì làm việc với nhiều đơn vị, khách hàng chỉ cần một
              đầu mối duy nhất để quản
              <br className="hidden lg:inline" /> lý toàn bộ dự án, giúp tiết
              kiệm thời gian, kiểm soát ngân sách và hạn chế phát sinh trong quá
              trình xây dựng.
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
          className={`${SERVICE_PROJECT_CTA_CLASS_NAME} max-md:!mt-3 lg:!mt-12 flex justify-center w-full`}
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
            textClassName="!text-[clamp(0.8rem,3.2vw,1.25rem)] lg:!text-2xl"
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
              <h2 className="font-heading text-[clamp(1.05rem,4.55vw,1.5rem)] leading-[1.12] uppercase md:text-4xl md:leading-normal">
                <span className="font-normal">GIẢI PHÁP THIẾT KẾ THI CÔNG</span>
                <br />
                <span className="font-extrabold md:font-bold">
                  THEO TỪNG LOẠI HÌNH CÔNG TRÌNH
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140} from="bottom">
              <p className="mx-auto mt-2 max-w-xl text-[clamp(0.72rem,2.9vw,0.86rem)] md:mt-4 md:text-sm md:leading-relaxed">
                Giải pháp thiết kế tối ưu cho từng không gian
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

      <section className="bg-[#f2f2f3] pt-12 pb-0 md:pb-12 lg:py-14">
        <div className="mx-auto mb-8 w-[min(49.375rem,calc(100%-2.25rem))] text-center">
          <Reveal>
            <h2 className="font-heading text-[clamp(0.95rem,4.2vw,1.35rem)] font-extrabold leading-[1.12] sm:text-[1.75rem] md:leading-normal">
              <span className="block whitespace-nowrap">QUY TRÌNH THIẾT KẾ THI CÔNG &amp;</span>
              <span className="block whitespace-nowrap">XÂY NHÀ TRỌN GÓI</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed">
              Triển khai đồng bộ, kiểm soát chất lượng trong từng giai đoạn
            </p>
          </Reveal>
          <BuildingRule
            className="mx-auto mt-3 h-[clamp(1.25rem,4vw,2rem)] w-[45vw] max-w-none md:w-full md:max-w-62.5"
            src="/images/xay-dung-tron-goi/rule-orange.png"
            delay={300}
          />
        </div>

        <ProcessStepsGrid mobileMockup />
      </section>

      <ContactForm mobileServiceMockup />
      <SiteFooter />
    </div>
  );
}
