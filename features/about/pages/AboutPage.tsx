import type { LucideIcon } from "lucide-react";
import {
  Award,
  BriefcaseBusiness,
  HeartHandshake,
  Lightbulb,
  Users,
} from "lucide-react";
import Image from "next/image";
import { AboutHero } from "@/features/about/components/AboutHero";
import { CapabilitiesSection } from "@/features/about/components/CapabilitiesSection";
import { JourneyTimeline } from "@/features/about/components/JourneyTimeline";
import { VisionMissionValues } from "@/features/about/components/VisionMissionValues";
import { PartnerMarquee } from "@/lib/components/layout/PartnerMarquee";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { Reveal } from "@/lib/components/shared/Reveal";
import { CapabilityProfileSection } from "@/features/home/components/CapabilityProfileSection";

const imageRoot = "/images/about/source";

const journey = [
  {
    year: "2011",
    title: "Thành lập công ty",
    description:
      "Chính thức hoạt động trong lĩnh vực thiết kế kiến trúc, thiết kế nội thất và thi công công trình.",
    image: `${imageRoot}/journey-2011.png`,
  },
  {
    year: "2014",
    title: "Mở rộng hoạt động",
    description:
      "Triển khai dịch vụ thiết kế và xây dựng trọn gói cho nhà ở và công trình thương mại.",
    image: `${imageRoot}/journey-2014.png`,
  },
  {
    year: "2017",
    title: "Phát triển đội ngũ",
    description:
      "Hoàn thiện quy trình thiết kế, thi công và quản lý dự án theo tiêu chuẩn chuyên nghiệp.",
    image: `${imageRoot}/journey-2017.png`,
  },
  {
    year: "2020",
    title: "Đẩy mạnh dự án",
    description:
      "Mở rộng triển khai nhiều công trình nhà ở, văn phòng, showroom và không gian kinh doanh.",
    image: `${imageRoot}/journey-2020.png`,
  },
] as const;

const coreValues: {
  title: string;
  description: string;
  icon: LucideIcon;
  featured?: boolean;
}[] = [
  {
    title: "Chất lượng là cam kết",
    description:
      "Chỉn chu từ hồ sơ thiết kế, vật liệu đến từng chi tiết thi công.",
    icon: Award,
  },
  {
    title: "Khách hàng là trọng tâm",
    description:
      "Lắng nghe, thấu hiểu và đặt lợi ích của khách hàng làm trung tâm.",
    icon: Users,
  },
  {
    title: "Sáng tạo là giá trị",
    description:
      "Không ngừng cập nhật xu hướng, đổi mới tư duy để tạo nên dấu ấn riêng cho mỗi công trình.",
    icon: Lightbulb,
    featured: true,
  },
  {
    title: "Tận tâm là trách nhiệm",
    description:
      "Đồng hành cùng khách hàng bằng tinh thần trách nhiệm cao nhất.",
    icon: HeartHandshake,
  },
  {
    title: "Chuyên nghiệp là nền tảng",
    description:
      "Quy trình chuẩn mực, đội ngũ chuyên môn và tiến độ minh bạch.",
    icon: BriefcaseBusiness,
  },
];

const capabilities = [
  {
    number: "01",
    title: "Tổng Thầu Thiết Kế & Thi Công",
    description:
      "Triển khai đồng bộ từ tư vấn, thiết kế, xin phép xây dựng đến thi công và hoàn thiện, đảm bảo sự thống nhất giữa thiết kế và thi công trong toàn bộ dự án.",
    image: `${imageRoot}/capability-turnkey.png`,
  },
  {
    number: "02",
    title: "Kiểm Soát Chất Lượng",
    description:
      "Kiểm soát chặt chẽ từ hồ sơ thiết kế, vật liệu, kỹ thuật thi công đến nghiệm thu, đảm bảo mỗi công trình được hoàn thiện đúng tiêu chuẩn và cam kết chất lượng.",
    image: `${imageRoot}/capability-quality.png`,
  },
  {
    number: "03",
    title: "Triển Khai Đa Loại Hình Công Trình",
    description:
      "Kinh nghiệm thực hiện nhà ở, văn phòng, showroom, nhà hàng, khách sạn và các công trình thương mại với giải pháp phù hợp cho từng quy mô dự án.",
    image: `${imageRoot}/capability-target.png`,
  },
  {
    number: "04",
    title: "Đồng Hành Dài Hạn",
    description:
      "Cam kết bảo hành, bảo trì và hỗ trợ kỹ thuật sau bàn giao, mang đến giá trị sử dụng lâu dài và sự an tâm cho khách hàng.",
    image: `${imageRoot}/capability-growth.png`,
  },
] as const;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
      <h2 className="text-[clamp(2.15rem,4vw,4rem)] font-bold uppercase leading-[0.95] tracking-[-0.025em] text-charcoal">
        {children}
      </h2>
      <BuildingRule className="mt-5 h-7 max-w-[390px]" />
    </div>
  );
}
function SectionHeadingPartNer({
  title,
  copy,
}: {
  title: string;
  copy?: string;
}) {
  return (
    <Reveal className="text-center">
      <h2 className="text-4xl font-extrabold tracking-[-0.035em] uppercase sm:text-5xl">
        {title}
      </h2>
      {copy && (
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
          {copy}
        </p>
      )}
      <BuildingRule className="mx-auto mt-4 max-w-72 text-brand" />
    </Reveal>
  );
}
function EditorialHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[clamp(1.75rem,2.6vw,2.75rem)] font-bold uppercase leading-none text-brand">
        {children}
      </h3>
      <BuildingRule className="mt-2 h-6 max-w-none" />
    </div>
  );
}

export function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden pt-16">
        <AboutHero />
        <JourneyTimeline />
        <VisionMissionValues />
        <section className="hidden relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-white lg:min-h-[720px]">
          <Image
            className="-z-20 object-cover object-[62%_center]"
            src={`${imageRoot}/hero-interior.png`}
            alt="Không gian nội thất phòng ăn hiện đại do BMT Decor thiết kế"
            fill
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,.98)_34%,rgba(255,255,255,.78)_48%,rgba(255,255,255,.08)_70%)] max-lg:bg-[linear-gradient(90deg,rgba(255,255,255,.98)_0%,rgba(255,255,255,.9)_58%,rgba(255,255,255,.32)_100%)]"
            aria-hidden="true"
          />

          <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-[min(1380px,calc(100%-2.25rem))] items-center py-16 lg:min-h-[720px]">
            <Reveal className="w-full max-w-[610px]" from="left">
              <p className="text-lg font-medium uppercase tracking-[0.02em] text-charcoal underline decoration-1 underline-offset-8 sm:text-xl">
                Về chúng tôi
              </p>
              <h1 className="mt-10 max-w-[590px] text-[clamp(2.75rem,5vw,5.15rem)] font-bold uppercase leading-[0.98] tracking-[-0.035em] text-brand">
                Kiến tạo giá trị từ mỗi không gian
              </h1>
              <BuildingRule className="mt-8 h-8 max-w-[410px] brightness-0" />
              <p className="mt-7 max-w-[570px] text-base leading-7 text-neutral-800 sm:text-lg sm:leading-8">
                BMT Decor là đơn vị thiết kế kiến trúc, thiết kế nội thất, thi
                công xây dựng và cải tạo trọn gói. Với hơn 15 năm kinh nghiệm,
                chúng tôi đồng hành từ ý tưởng đến hiện thực, kiến tạo không
                gian hài hòa giữa công năng, thẩm mỹ và chất lượng bền vững.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="hidden bg-white py-24 sm:py-28 lg:py-32">
          <div className="mx-auto w-[min(1380px,calc(100%-2.25rem))]">
            <Reveal>
              <SectionHeading>Hành trình của BMT Decor</SectionHeading>
            </Reveal>

            <div className="relative mt-16 grid gap-12 md:grid-cols-4 md:gap-0 lg:mt-20">
              <div className="absolute left-[10%] right-[10%] top-[88px] hidden border-t-2 border-dotted border-neutral-400 md:block" />
              {journey.map((item, index) => (
                <Reveal
                  className="relative"
                  delay={index * 110}
                  key={item.year}
                >
                  <article className="grid grid-cols-[88px_1fr] gap-5 md:block md:px-5">
                    <div className="relative z-10 mx-auto size-[88px] overflow-hidden rounded-full bg-brand shadow-[0_0_0_10px_white] md:size-28">
                      <Image
                        className="object-cover"
                        src={item.image}
                        alt=""
                        fill
                        sizes="112px"
                      />
                    </div>
                    <div className="md:mt-8 md:grid md:grid-cols-[52px_1fr] md:gap-4">
                      <span className="text-4xl font-bold leading-none text-brand md:[writing-mode:vertical-rl] md:rotate-180 md:text-neutral-500">
                        {item.year}
                      </span>
                      <div>
                        <h3 className="mt-2 text-lg font-bold uppercase leading-tight text-charcoal md:mt-0">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-[15px] leading-6 text-neutral-700">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="hidden relative isolate bg-[#f4f4f4] py-24 sm:py-28 lg:py-32">
          <Image
            className="-z-10 object-cover object-bottom opacity-80"
            src={`${imageRoot}/city-blueprint.png`}
            alt=""
            fill
            sizes="100vw"
          />
          <div className="mx-auto grid w-[min(1380px,calc(100%-2.25rem))] items-center gap-14 lg:grid-cols-[.9fr_1.3fr_1fr] lg:gap-10">
            <div className="space-y-14">
              <Reveal from="left">
                <EditorialHeading>Tầm nhìn</EditorialHeading>
                <p className="mt-5 text-base leading-7 text-neutral-700">
                  Trở thành đơn vị thiết kế và thi công được khách hàng tin
                  tưởng lựa chọn nhờ năng lực chuyên môn, quy trình chuyên
                  nghiệp và chất lượng công trình, không ngừng nâng cao giá trị
                  cho từng không gian sống và làm việc.
                </p>
              </Reveal>
              <Reveal delay={120} from="left">
                <EditorialHeading>Sứ mệnh</EditorialHeading>
                <p className="mt-5 text-base leading-7 text-neutral-700">
                  Mang đến giải pháp thiết kế và thi công trọn gói chuyên
                  nghiệp, giúp khách hàng sở hữu không gian tối ưu công năng,
                  hài hòa thẩm mỹ và bền vững chất lượng.
                </p>
              </Reveal>
            </div>

            <Reveal className="order-first lg:order-none" delay={120}>
              <Image
                className="mx-auto h-auto w-full max-w-[640px]"
                src={`${imageRoot}/architect-isometric.png`}
                alt="Kiến trúc sư BMT Decor phát triển phương án thiết kế"
                width={1739}
                height={1417}
                sizes="(max-width: 1024px) 90vw, 42vw"
              />
            </Reveal>

            <Reveal delay={220} from="right">
              <EditorialHeading>Giá trị cốt lõi</EditorialHeading>
              <ul className="mt-6 space-y-5">
                {coreValues.map(
                  ({ title, description, icon: Icon, featured }) => (
                    <li className="grid grid-cols-[52px_1fr] gap-4" key={title}>
                      <span
                        className={`grid size-[52px] place-items-center rounded-full ${
                          featured
                            ? "bg-brand text-white"
                            : "bg-charcoal text-white"
                        }`}
                      >
                        <Icon className="size-6 stroke-[1.7]" />
                      </span>
                      <div className="border-l border-brand/30 pl-4">
                        <h4
                          className={`font-bold uppercase ${featured ? "text-brand" : "text-charcoal"}`}
                        >
                          {title}
                        </h4>
                        <p className="mt-1 text-sm leading-5 text-neutral-700">
                          {description}
                        </p>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </Reveal>
          </div>
        </section>

        <CapabilitiesSection />

        <section className="hidden bg-white py-24 sm:py-28 lg:py-32">
          <div className="mx-auto w-[min(1380px,calc(100%-2.25rem))]">
            <Reveal>
              <SectionHeading>Năng lực nổi bật</SectionHeading>
            </Reveal>
            <div className="mt-16 grid gap-14 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4 xl:gap-8">
              {capabilities.map((item, index) => (
                <Reveal
                  className="relative"
                  delay={index * 100}
                  key={item.number}
                >
                  <article>
                    <div className="flex items-end gap-5">
                      <div className="relative size-28 shrink-0 sm:size-32">
                        <Image
                          className="object-contain"
                          src={item.image}
                          alt=""
                          fill
                          sizes="128px"
                        />
                      </div>
                      <div className="mb-2 flex min-w-0 flex-1 items-end gap-3">
                        <span className="text-5xl font-bold leading-none text-charcoal">
                          {item.number}
                        </span>
                        <span className="mb-1 h-px flex-1 bg-charcoal" />
                        <span className="mb-0.5 size-2 rounded-full bg-charcoal" />
                      </div>
                    </div>
                    <h3 className="mt-8 text-xl font-bold uppercase leading-tight text-charcoal">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-7 text-neutral-700">
                      {item.description}
                    </p>
                    {index < capabilities.length - 1 && (
                      <span
                        className="absolute -right-6 top-28 hidden text-5xl font-light leading-none text-brand xl:block"
                        aria-hidden="true"
                      >
                        ›
                      </span>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-24 sm:py-28 lg:py-32">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -bottom-10 z-0 overflow-hidden bg-[#f6f6f6] sm:-bottom-11 lg:-bottom-12"
            aria-hidden="true"
          >
            <Image
              className="object-cover object-bottom opacity-55"
              src={`${imageRoot}/city-blueprint.png`}
              alt=""
              fill
              sizes="100vw"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -bottom-10 z-20 overflow-hidden bg-[#f6f6f6] [--cutout-height:2.5rem] [--cutout-radius:2.25rem] sm:-bottom-11 sm:[--cutout-height:2.75rem] sm:[--cutout-radius:2.75rem] lg:-bottom-12 lg:[--cutout-height:3rem] lg:[--cutout-radius:3rem]"
            style={{
              clipPath:
                "inset(calc(100% - var(--cutout-height)) 0 0 50% round 0 0 0 var(--cutout-radius))",
            }}
            aria-hidden="true"
          >
            <Image
              className="object-cover object-bottom opacity-55"
              src={`${imageRoot}/city-blueprint.png`}
              alt=""
              fill
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 mx-auto w-[min(1280px,calc(100%-2.25rem))]">
            <section className="py-14">
              <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
                <SectionHeadingPartNer title="Đối tác của BMT Decor" />
                <Reveal delay={120}>
                  <PartnerMarquee />
                </Reveal>
              </div>
            </section>
          </div>
        </section>

        <ContactForm revealPreviousBackground />
      </main>
      <SiteFooter />
    </>
  );
}
