import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { BuildingRule } from "@/shared/components/BuildingRule";
import { Reveal } from "@/shared/components/Reveal";
import { ContactForm } from "@/shared/components/ContactForm";
import { HomeHero } from "@/features/home/components/HomeHero";
import { ProjectShowcase } from "@/features/home/components/ProjectShowcase";
import { FeaturedServicesSection } from "@/features/home/components/FeaturedServicesSection";
import { CountUpStats } from "@/features/home/components/CountUpStats";
import { PartnerSection } from "@/features/home/components/PartnerSection";
import { CapabilityProfileSection } from "@/features/home/components/CapabilityProfileSection";
import { TrustCardReveal } from "@/features/home/components/TrustCardReveal";
import { TrustIntro } from "@/features/home/components/TrustIntro";
import { MobileTrustAccordion } from "@/features/home/components/MobileTrustAccordion";
import {
  homeNews as news,
  homeSectionContent,
  homeTrustReasons as trustReasons,
} from "@/features/home/data/home-content";

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
          {homeSectionContent.featuredProjects.title}
        </h2>
      </Reveal>
      <Reveal delay={140}>
        <p className="mx-auto mt-3 max-w-2xl text-xl leading-relaxed text-muted-foreground max-sm:text-sm">
          {homeSectionContent.featuredProjects.description}
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
        <div className="relative overflow-hidden bg-white pt-16 text-charcoal">
          <div className="relative mx-auto w-[min(1360px,calc(100%-2rem))]">
            <TrustIntro />

            <div className="mt-9 hidden h-44 lg:block" aria-hidden="true" />
            <div className="mt-7 pb-10 lg:hidden">
              <MobileTrustAccordion />
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
          <SectionHeading title={homeSectionContent.featuredNews.title} />
          <div className="mt-9 grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <Reveal className="self-start">
              <Link className="group block" href="/news">
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
                    href="/news"
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
                  href="/news"
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
