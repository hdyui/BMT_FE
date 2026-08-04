import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { HomeHero } from "@/features/home/components/HomeHero";
import { ProjectShowcase } from "@/features/home/components/ProjectShowcase";
import { ServiceShowcase } from "@/features/home/components/ServiceShowcase";
import { CountUpStats } from "@/features/home/components/CountUpStats";
import { PartnerMarquee } from "@/lib/components/layout/PartnerMarquee";
import { CapabilityProfileSection } from "@/features/home/components/CapabilityProfileSection";
import { TrustCardReveal } from "@/features/home/components/TrustCardReveal";
import { TrustIntro } from "@/features/home/components/TrustIntro";

const trustReasons = [
  {
    image: "/images/home/trust-card-interior.png",
    icon: "/images/home/trust-icon-team.png",
    title: "Đội ngũ giàu kinh nghiệm",
    copy: "Kiến trúc sư và kỹ sư giàu chuyên môn, tận tâm trong từng hạng mục.",
  },
  {
    image: "/images/home/trust-card-design.png",
    icon: "/images/home/trust-icon-plan.png",
    title: "Quy trình chuyên nghiệp",
    copy: "Quy trình làm việc rõ ràng, minh bạch, đảm bảo tiến độ và chất lượng.",
  },
  {
    image: "/images/home/trust-card-build.png",
    icon: "/images/home/trust-icon-process.png",
    title: "Thi công trọn gói, đồng bộ",
    copy: "Từ thiết kế đến hoàn thiện đều được triển khai trong một hệ thống thống nhất.",
  },
  {
    image: "/images/home/trust-card-site.png",
    icon: "/images/home/trust-icon-quality.png",
    title: "Chất lượng thi công",
    copy: "Vật liệu đúng cam kết, kỹ thuật chuẩn xác và kiểm soát chất lượng chặt chẽ.",
  },
] as const;

const news = [
  {
    image: "/images/home/news-01.png",
    title: "Những lưu ý quan trọng khi bắt đầu thiết kế nhà ở",
  },
  {
    image: "/images/home/news-02.png",
    title: "Cách lựa chọn phong cách nội thất phù hợp",
  },
  {
    image: "/images/home/news-03.png",
    title: "Tối ưu ngân sách mà vẫn đảm bảo chất lượng công trình",
  },
] as const;

function SectionHeading({ title, copy }: { title: string; copy?: string }) {
  return (
    <Reveal className="text-center">
      <h2 className="text-3xl font-bold uppercase sm:text-4xl">{title}</h2>
      {copy && (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {copy}
        </p>
      )}
      <BuildingRule className="mx-auto mt-4 max-w-72 text-brand" />
    </Reveal>
  );
}

function ProjectSectionHeading() {
  return (
    <div className="text-center">
      <Reveal>
        <h2 className="text-3xl font-bold uppercase sm:text-4xl">
          Dự án tiêu biểu
        </h2>
      </Reveal>
      <Reveal delay={140}>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Khám phá những công trình do BMT Decor trực tiếp thiết kế và thi công,
          khẳng định năng lực và chất lượng trong từng hạng mục.
        </p>
      </Reveal>
      <BuildingRule className="mx-auto mt-4 max-w-72 text-brand" />
    </div>
  );
}

function ServiceSectionHeading() {
  return (
    <div className="text-center">
      <Reveal>
        <h2 className="text-3xl font-bold uppercase sm:text-4xl">
          Dịch vụ nổi bật
        </h2>
      </Reveal>
      <Reveal delay={140}>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          BMT Decor cung cấp dịch vụ thiết kế và thi công trọn gói, đáp ứng đa
          dạng nhu cầu từ nhà ở đến không gian kinh doanh.
        </p>
      </Reveal>
      <BuildingRule className="mx-auto mt-4 max-w-72 text-brand" />
    </div>
  );
}

export function HomePage() {
  return (
    <div className="min-h-screen overflow-x-clip pt-16">
      <SiteHeader />
      <HomeHero />

      <section className="bg-white">
        <div className="relative overflow-hidden bg-charcoal pt-16 text-white">
          <Image
            className="object-cover"
            src="/images/home/trust-background.png"
            alt=""
            fill
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-charcoal/15" />

          <div className="relative mx-auto w-[min(1360px,calc(100%-2rem))]">
            <TrustIntro />

            <div className="mt-9 hidden h-44 lg:block" aria-hidden="true" />

            <div className="mt-9 grid gap-6 pb-12 sm:grid-cols-2 lg:hidden">
              {trustReasons.map((reason, index) => (
                <TrustCardReveal
                  className="group/card-lift relative z-0 hover:z-10"
                  delay={index * 180}
                  key={reason.title}
                  motionClassName="origin-[center_176px] [transform:scale(1)] transition-transform duration-300 ease-in-out group-hover/card-lift:[transform:scale(1.015)]"
                >
                  <article className="group/card relative z-0 overflow-hidden rounded-2xl bg-white text-charcoal shadow-xl transition-shadow duration-300 ease-in-out hover:z-10 hover:shadow-[0_20px_45px_rgb(47_38_34/.2)]">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        className="object-cover"
                        src={reason.image}
                        alt={reason.title}
                        fill
                        sizes="(max-width:640px) 100vw, 50vw"
                      />
                    </div>
                    <div className="relative px-6 pt-11 pb-7">
                      <span className="absolute -top-8 left-6 grid size-16 place-items-center rounded-lg bg-white shadow-lg transition-colors duration-[700ms] group-hover/card:bg-brand">
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
                      <h3 className="text-lg font-bold leading-snug">
                        {reason.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
              className="group/card-lift relative z-0 hover:z-10"
              delay={index * 180}
              key={reason.title}
              motionClassName="origin-[center_176px] [transform:scale(1)] transition-transform duration-300 ease-in-out group-hover/card-lift:[transform:scale(1.02)]"
            >
              <article className="group/card relative z-0 overflow-hidden rounded-2xl bg-white text-charcoal shadow-xl transition-shadow duration-300 ease-in-out hover:z-10 hover:shadow-[0_20px_45px_rgb(47_38_34/.2)]">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    className="object-cover"
                    src={reason.image}
                    alt={reason.title}
                    fill
                    sizes="25vw"
                  />
                </div>
                <div className="relative min-h-44 px-6 pt-11 pb-7">
                  <span className="absolute -top-8 left-6 grid size-16 place-items-center rounded-lg bg-white shadow-lg transition-colors duration-300 group-hover/card:bg-brand">
                    <Image
                      className="size-9 object-contain transition-opacity duration-300 group-hover/card:opacity-0"
                      src={reason.icon}
                      alt=""
                      width={44}
                      height={44}
                    />
                    <Image
                      className="absolute size-9 object-contain opacity-0 brightness-0 invert transition-opacity duration-300 group-hover/card:opacity-100"
                      src={reason.icon}
                      alt=""
                      width={44}
                      height={44}
                    />
                  </span>
                  <h3 className="text-lg font-bold leading-snug">
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {reason.copy}
                  </p>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover/card:scale-x-100" />
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
        <div className="relative mx-auto w-[min(1200px,calc(100%-2.25rem))]">
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
          <section className="py-16">
            <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
              <ServiceSectionHeading />
              <ServiceShowcase />
            </div>
          </section>

          <section className="py-14">
            <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
              <SectionHeading title="Đối tác của BMT Decor" />
              <Reveal delay={120}>
                <PartnerMarquee />
              </Reveal>
            </div>
          </section>

          <CapabilityProfileSection />
        </div>
      </div>

      <section className="bg-white py-16">
        <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
          <SectionHeading title="Tin nổi bật" />
          <div className="mt-9 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <Link className="group block" href="/tin-tuc">
                <div className="relative h-80 overflow-hidden rounded-3xl">
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
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Cập nhật xu hướng thiết kế, kinh nghiệm thi công và các giải
                  pháp hữu ích từ đội ngũ BMT Decor.
                </p>
              </Link>
            </Reveal>
            <div className="grid gap-4">
              {news.map((item, index) => (
                <Reveal delay={index * 100} key={item.title}>
                  <Link
                    className="group grid grid-cols-[125px_1fr] items-center gap-5"
                    href="/tin-tuc"
                  >
                    <div className="relative h-24 overflow-hidden rounded-2xl">
                      <Image
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        src={item.image}
                        alt=""
                        fill
                        sizes="125px"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold transition-colors group-hover:text-brand">
                        {item.title}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-brand">
                        Đọc tiếp <ArrowUpRight className="size-3" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
              <Reveal className="ml-auto w-fit" delay={320}>
                <Link
                  className="group inline-flex origin-center items-center gap-2 text-xl font-semibold text-brand transition-[color,transform] duration-300 ease-out hover:scale-105 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
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

      <ContactForm />
      <SiteFooter />
    </div>
  );
}
