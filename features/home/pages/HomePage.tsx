import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { HomeHero } from "@/features/home/components/HomeHero";
import { ProjectShowcase } from "@/features/home/components/ProjectShowcase";
import { FeaturedServicesSection } from "@/features/home/components/FeaturedServicesSection";
import { CountUpStats } from "@/features/home/components/CountUpStats";
import { PartnerSection } from "@/features/home/components/PartnerSection";
import { CapabilityProfileSection } from "@/features/home/components/CapabilityProfileSection";
import { TrustCardReveal } from "@/features/home/components/TrustCardReveal";
import { TrustIntro } from "@/features/home/components/TrustIntro";

const trustReasons = [
  {
    image: "/images/home/trust-card-interior.png",
    desktopImage: "/images/home/trust-card-team-normal.png",
    desktopHoverImage: "/images/home/trust-card-team-hover.png",
    icon: "/images/home/trust-icon-team.png",
    title: "Đội ngũ giàu kinh nghiệm",
    copy: "Kiến trúc sư và kỹ sư giàu chuyên môn, luôn đồng hành và tư vấn giải pháp phù hợp với nhu cầu của khách hàng.",
  },
  {
    image: "/images/home/trust-card-design.png",
    desktopImage: "/images/home/trust-card-process-normal.png",
    desktopHoverImage: "/images/home/trust-card-process-hover.png",
    icon: "/images/home/trust-icon-plan.png",
    title: "Quy trình chuyên nghiệp",
    copy: "Quy trình làm việc rõ ràng, minh bạch, kiểm soát tiến độ và chất lượng trong từng giai đoạn.",
  },
  {
    image: "/images/home/trust-card-build.png",
    desktopImage: "/images/home/trust-card-turnkey-normal.png",
    desktopHoverImage: "/images/home/trust-card-turnkey-hover.png",
    icon: "/images/home/trust-icon-process.png",
    title: "Thi công trọn gói, đồng bộ",
    copy: "Triển khai xuyên suốt từ thiết kế đến hoàn thiện, đảm bảo tính thống nhất và tối ưu thời gian, chi phí.",
  },
  {
    image: "/images/home/trust-card-site.png",
    desktopImage: "/images/home/trust-card-quality-normal.png",
    desktopHoverImage: "/images/home/trust-card-quality-hover.png",
    icon: "/images/home/trust-icon-quality.png",
    title: "Chất lượng thi công",
    copy: "Thi công đúng kỹ thuật, sử dụng vật liệu phù hợp và kiểm tra kỹ lưỡng trước khi bàn giao.",
  },
] as const;

const news = [
  {
    image: "/images/home/news-01.png",
    title: "Những lưu ý quan trọng khi bắt đầu thiết kế nhà ở",
    copy: "Những yếu tố cần chuẩn bị trước khi thiết kế để tối ưu công năng, chi phí và hạn chế thay đổi trong quá trình thi công.",
  },
  {
    image: "/images/home/news-02.png",
    title: "Cách lựa chọn phong cách nội thất phù hợp",
    copy: "Gợi ý lựa chọn phong cách dựa trên nhu cầu sử dụng, sở thích cá nhân và đặc điểm thực tế của từng không gian.",
  },
  {
    image: "/images/home/news-03.png",
    title: "Tối ưu ngân sách mà vẫn đảm bảo chất lượng công trình",
    copy: "Cách phân bổ ngân sách hợp lý cho từng hạng mục mà vẫn duy trì chất lượng vật liệu, kỹ thuật và giá trị sử dụng lâu dài.",
  },
] as const;

function SectionHeading({ title, copy }: { title: string; copy?: string }) {
  return (
    <Reveal className="text-center">
      <h2 className="text-4xl font-extrabold tracking-[-0.035em] uppercase sm:text-5xl max-sm:text-[26px] max-sm:leading-none">
        {title}
      </h2>
      {copy && (
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[17px] max-sm:text-sm">
          {copy}
        </p>
      )}
      <BuildingRule className="mx-auto mt-4 max-w-72 text-brand max-sm:mt-2 max-sm:max-w-[200px]" />
    </Reveal>
  );
}

function ProjectSectionHeading() {
  return (
    <div className="text-center">
      <Reveal>
        <h2 className="text-4xl font-extrabold tracking-[-0.035em] uppercase sm:text-5xl max-sm:text-[26px] max-sm:leading-none">
          Dự án tiêu biểu
        </h2>
      </Reveal>
      <Reveal delay={140}>
        <p className="mx-auto mt-3 max-w-2xl text-xl leading-relaxed text-muted-foreground max-sm:text-sm">
          Khám phá những công trình do BMT Decor trực tiếp thiết kế và thi công,
          khẳng định năng lực và chất lượng trong từng hạng mục.
        </p>
      </Reveal>
    </div>
  );
}

export function HomePage() {
  return (
    <div
      className="min-h-screen overflow-x-clip pt-[60px] xl:pt-[var(--site-header-desktop-height)]"
      data-scroll-snap-page
    >
      <SiteHeader />
      <HomeHero />

      <section className="bg-white">
        <div className="relative overflow-hidden bg-charcoal pt-16 text-white lg:bg-white lg:text-charcoal">
          <Image
            className="object-cover lg:hidden"
            src="/images/home/trust-background.png"
            alt=""
            fill
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-charcoal/15 lg:hidden" />

          <div className="relative mx-auto w-[min(1360px,calc(100%-2rem))]">
            <TrustIntro />

            <div className="mt-9 hidden h-44 lg:block" aria-hidden="true" />

            <div className="mt-9 grid gap-6 pb-12 sm:grid-cols-2 lg:hidden max-sm:relative max-sm:left-1/2 max-sm:w-screen max-sm:-translate-x-1/2 max-sm:gap-4 max-sm:px-4 max-sm:text-charcoal max-sm:before:absolute max-sm:before:inset-x-0 max-sm:before:top-36 max-sm:before:bottom-0 max-sm:before:bg-white">
              {trustReasons.map((reason, index) => (
                <TrustCardReveal
                  className="group/card-lift relative z-0 hover:z-10 sm:h-full"
                  delay={index * 180}
                  key={reason.title}
                  motionClassName="origin-[center_176px] [transform:scale(1)] transition-transform duration-300 ease-in-out group-hover/card-lift:[transform:scale(1.015)] sm:h-full"
                >
                  <article
                    className="group/card relative z-0 overflow-hidden rounded-2xl bg-white text-charcoal shadow-xl transition-shadow duration-300 ease-in-out hover:z-10 hover:shadow-[0_20px_45px_rgb(47_38_34/.2)] sm:flex sm:h-[410px] sm:flex-col max-sm:z-10 max-sm:shadow-[0_6px_18px_rgb(36_33_34/.16)]"
                  >
                    <div className="relative h-44 overflow-hidden sm:shrink-0 max-sm:h-36">
                      <Image
                        className="object-cover"
                        src={reason.image}
                        alt={reason.title}
                        fill
                        sizes="(max-width:640px) 100vw, 50vw"
                      />
                    </div>
                    <div className="relative px-6 pt-11 pb-7 sm:min-h-0 sm:flex-1 max-sm:px-4 max-sm:pt-9 max-sm:pb-4">
                      <span className="absolute -top-8 left-6 z-20 grid size-16 place-items-center rounded-lg bg-white shadow-lg transition-colors duration-[700ms] group-hover/card:bg-brand max-sm:left-4">
                        <Image
                          className="size-9 object-contain transition-opacity duration-[700ms] group-hover/card:opacity-0"
                          src={reason.icon}
                          alt=""
                          width={44}
                          height={44}
                        />
                        <Image
                          className="absolute size-9 object-contain opacity-0 brightness-0 invert transition-opacity duration-[700ms] group-hover/card:opacity-100"
                          src={reason.icon}
                          alt=""
                          width={44}
                          height={44}
                        />
                      </span>
                      <h3 className="text-lg font-bold leading-snug sm:line-clamp-1 max-sm:text-[20px] max-sm:font-extrabold max-sm:leading-[1.12] max-sm:tracking-[-0.025em]">
                        {reason.title}
                      </h3>
                      <p className="mt-3 text-xl leading-relaxed text-muted-foreground sm:line-clamp-4 sm:text-[17px] sm:leading-[1.55] max-sm:mt-1.5 max-sm:text-[14px] max-sm:font-medium max-sm:leading-[1.3] max-sm:tracking-[-0.012em] max-sm:text-charcoal/90">
                        {reason.copy}
                      </p>
                    </div>
                    <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover/card:scale-x-100" />
                  </article>
                </TrustCardReveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto -mt-44 hidden w-[min(1360px,calc(100%-2rem))] grid-cols-4 gap-5 lg:grid">
          {trustReasons.map((reason, index) => (
            <TrustCardReveal
              className="relative"
              delay={index * 110}
              key={reason.title}
            >
              <article
                className="group/card relative isolate aspect-[1189/1656] overflow-hidden rounded-2xl bg-white text-white outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                tabIndex={0}
                aria-labelledby={`trust-title-${index}`}
                aria-describedby={`trust-copy-${index}`}
              >
                <Image
                  className="object-cover transition-opacity duration-500 ease-out group-hover/card:opacity-0 group-focus/card:opacity-0 motion-reduce:transition-none"
                  src={reason.desktopImage}
                  alt=""
                  fill
                  sizes="(max-width:1279px) 25vw, 325px"
                />

                <Image
                  className="pointer-events-none object-cover opacity-0 transition-opacity duration-500 ease-out group-hover/card:opacity-100 group-focus/card:opacity-100 motion-reduce:transition-none"
                  src={reason.desktopHoverImage}
                  alt=""
                  fill
                  sizes="(max-width:1279px) 25vw, 325px"
                  aria-hidden="true"
                />

                <Image
                  className="pointer-events-none scale-[1.01] object-cover opacity-0 transition-opacity duration-500 ease-out group-hover/card:opacity-100 group-focus/card:opacity-100 motion-reduce:transition-none"
                  src="/images/home/trust-card-hover-overlay.png"
                  alt=""
                  fill
                  sizes="(max-width:1279px) 25vw, 325px"
                  aria-hidden="true"
                />

                <h3
                  id={`trust-title-${index}`}
                  className="absolute inset-x-6 bottom-7 z-10 text-xl font-bold leading-snug transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:-translate-y-32 group-focus/card:-translate-y-32 xl:group-hover/card:-translate-y-20 xl:group-focus/card:-translate-y-20 motion-reduce:transition-none"
                >
                  {reason.title}
                </h3>
                <p
                  id={`trust-copy-${index}`}
                  className="absolute inset-x-6 bottom-7 z-10 translate-y-3 text-justify text-sm leading-[1.55] text-white opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [text-align-last:left] [text-justify:inter-word] group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus/card:translate-y-0 group-focus/card:opacity-100 motion-reduce:transition-none"
                >
                  {reason.copy}
                </p>
              </article>
            </TrustCardReveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <Reveal>
          <CountUpStats />
        </Reveal>
      </section>

      <section className="relative bg-neutral-100 py-16">
        <Image
          className="object-cover opacity-80"
          src="/images/home/projects-background.png"
          alt=""
          fill
          sizes="100vw"
        />
        <div className="relative mx-auto w-[min(1320px,calc(100%-2.25rem))]">
          <ProjectSectionHeading />
          <ProjectShowcase />
        </div>
      </section>

      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, #ffffff 0%, #ffffff 42%, #f7f7f8 68%, #ececef 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-top bg-repeat-y opacity-85 mix-blend-multiply [filter:contrast(1.2)]"
          style={{
            backgroundImage: "url('/images/home/blueprint-background.png')",
            backgroundSize: "1922px 440px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,.16) 48%, rgba(0,0,0,.58) 70%, #000 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,.16) 48%, rgba(0,0,0,.58) 70%, #000 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative">
          <FeaturedServicesSection />

          <PartnerSection />

          <CapabilityProfileSection />
        </div>
      </div>

      <section className="relative -mb-[2.342945vw] overflow-hidden bg-neutral-100 pt-16 pb-[calc(4rem+2.342945vw)] lg:-mb-[2.57vw] lg:pb-[calc(4rem+2.57vw)]">
        <div
          className="pointer-events-none absolute inset-0 bg-top bg-repeat-y opacity-35 mix-blend-multiply"
          style={{
            backgroundImage: "url('/images/home/blueprint-background.png')",
            backgroundSize: "1922px 440px",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-[min(1100px,calc(100%-2.25rem))]">
          <SectionHeading title="Tin nổi bật" />
          <div className="mt-9 grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <Reveal className="self-start">
              <Link className="group block" href="/tin-tuc">
                <div
                  className="relative overflow-hidden rounded-3xl"
                  style={{ aspectRatio: "1.65 / 1" }}
                >
                  <Image
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    src="/images/home/news-featured.png"
                    alt="Không gian nội thất do BMT Decor thực hiện"
                    fill
                    sizes="(max-width:1024px) 100vw, 55vw"
                  />
                </div>
                <h3 className="mt-5 text-xl font-bold transition-colors group-hover:text-brand">
                  Bí quyết kiến tạo không gian sống hiện đại và bền vững
                </h3>
                <p className="mt-2 text-justify text-sm leading-relaxed text-muted-foreground [text-align-last:left] [text-justify:inter-character] max-sm:line-clamp-2 max-sm:text-left max-sm:text-[14px] max-sm:font-normal max-sm:leading-[1.35] max-sm:text-charcoal/80">
                  Cập nhật xu hướng thiết kế, kinh nghiệm thi công và các giải
                  pháp hữu ích từ đội ngũ BMT Decor.
                </p>
              </Link>
            </Reveal>
            <div className="grid gap-4">
              {news.map((item, index) => (
                <Reveal delay={index * 100} key={item.title}>
                  <Link
                    className="group grid grid-cols-[132px_1fr] items-center gap-5 max-sm:grid-cols-[46%_1fr] max-sm:gap-4"
                    href="/tin-tuc"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl max-sm:aspect-[1.75/1]">
                      <Image
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        src={item.image}
                        alt=""
                        fill
                        sizes="132px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-extrabold leading-snug text-charcoal transition-colors group-hover:text-brand max-sm:line-clamp-2 max-sm:text-[16px] max-sm:font-bold max-sm:leading-[1.12] max-sm:text-charcoal max-sm:group-hover:text-charcoal">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-justify text-sm leading-[1.45] text-muted-foreground [text-align-last:left] [text-justify:inter-character] max-sm:mt-1.5 max-sm:line-clamp-2 max-sm:text-left max-sm:text-[13px] max-sm:font-normal max-sm:leading-[1.3] max-sm:text-charcoal/80">
                        {item.copy}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
              <Reveal className="ml-auto w-fit" delay={320}>
                <Link
                  className="group inline-flex origin-center items-center gap-2 text-base font-bold text-brand underline decoration-2 underline-offset-4 transition-[color,transform] duration-300 ease-out hover:scale-105 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                  href="/tin-tuc"
                >
                  XEM TẤT CẢ TIN
                  <Image
                    className="size-6 object-contain transition-[filter,transform] duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:brightness-75"
                    src="/images/home/arrow-orange.png"
                    alt=""
                    width={24}
                    height={24}
                  />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ContactForm showTopNotch />
      <SiteFooter showTopBorder={false} />
    </div>
  );
}
