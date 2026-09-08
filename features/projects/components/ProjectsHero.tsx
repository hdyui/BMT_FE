import Image from "next/image";
import { projectsPageHeroContent } from "@/features/projects/data/projects-page";

const projectHeroTitleLines = projectsPageHeroContent.title.split("\n");

export function ProjectsHero() {
  return (
    <section
      className="relative z-[1] isolate h-[570px] overflow-hidden bg-[#f2f2f4] [--outline-dot-size:clamp(22px,1.9vw,38px)] [--outline-radius:3vw] max-sm:h-auto max-sm:aspect-[3884/5972] sm:min-h-[650px] lg:h-[max(500px,calc(39.0625vw+40px))] lg:min-h-0"
    >
      <Image
        src="/images/projects/hero-blueprint.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none z-0 hidden object-fill animate-[projects-decor-fade_.72s_.24s_ease-out_both] [clip-path:polygon(0_0,39.5%_0,39.5%_55%,59.5%_55%,59.5%_0,100%_0,100%_100%,9.5%_100%,9.5%_63%,0_63%)] motion-reduce:animate-none lg:block"
        aria-hidden="true"
      />

      <Image
        src="/images/projects/hero-blueprint.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none z-[5] hidden -translate-y-[60px] object-fill [backface-visibility:hidden] animate-[projects-decor-fade_.72s_.24s_ease-out_both] [clip-path:inset(0_40.5%_45%_39.5%)] motion-reduce:animate-none lg:block"
        aria-hidden="true"
      />

      <Image
        src="/images/projects/hero-blueprint.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none z-[2] hidden object-fill animate-[projects-decor-fade_.72s_.3s_ease-out_both] [clip-path:inset(63%_90.5%_0_0)] motion-reduce:animate-none lg:block"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute top-[6%] left-[3.6%] z-[1] hidden h-[68%] w-[30%] rounded-tl-[4.5rem] bg-[#d5d5d5] animate-[projects-decor-fade_.72s_.42s_ease-out_both] motion-reduce:animate-none lg:block"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute top-[9%] left-[9.2%] z-10 hidden aspect-[2000/1700] w-[37.7%] overflow-hidden rounded-tl-[5.4rem] rounded-br-[5.4rem] lg:block">
        <Image
          src="/images/projects/hero-plans.png"
          alt="Kiến trúc sư làm việc trên bản vẽ công trình"
          fill
          priority
          sizes="38vw"
          className="object-cover origin-center animate-[projects-hero-arrive_1.15s_.12s_cubic-bezier(.22,1,.36,1)_both] motion-reduce:animate-none"
        />
      </div>

      <div
        className="pointer-events-none absolute top-[57.6%] left-[33.2%] z-[15] hidden h-[38.2%] w-[18.5%] isolate animate-[projects-decor-fade_.72s_.64s_ease-out_both] motion-reduce:animate-none lg:block"
        aria-hidden="true"
      >
        <span className="absolute inset-0 z-0 rounded-[var(--outline-radius)_0_var(--outline-radius)_0] border border-[rgb(119_119_119/.9)]" />
        <span className="absolute top-[76%] right-[calc(var(--outline-dot-size)/-2)] z-[2] size-[var(--outline-dot-size)] -translate-y-1/2 rounded-full bg-brand [backface-visibility:hidden]" />
      </div>

      <Image
        src="/images/projects/mobile/hero-composition.png"
        alt=""
        width={3884}
        height={5972}
        priority
        sizes="(max-width: 639px) 100vw, 1px"
        className="pointer-events-none absolute inset-x-0 top-[-12px] z-0 h-auto w-full origin-[50%_58%] animate-[projects-hero-arrive_1.15s_.12s_cubic-bezier(.22,1,.36,1)_both] motion-reduce:animate-none sm:hidden"
        aria-hidden="true"
      />

      <div className="relative mx-auto h-full w-full sm:grid sm:min-h-[650px] sm:w-[min(1380px,calc(100%-2.25rem))] sm:items-center sm:gap-10 sm:py-12 lg:block lg:min-h-0 lg:w-full lg:py-0">
        <div
          className="pointer-events-none hidden origin-[28%_50%] animate-[projects-hero-arrive_1.15s_.12s_cubic-bezier(.22,1,.36,1)_both] motion-reduce:animate-none sm:relative sm:block sm:aspect-[1.12/1] sm:w-auto sm:overflow-hidden sm:rounded-tl-[4.5rem] sm:rounded-br-[4.5rem] lg:hidden"
        >
          <Image
            src="/images/projects/hero-plans.png"
            alt="Kiến trúc sư làm việc trên bản vẽ công trình"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute top-[97px] right-[7%] left-[8%] z-30 text-left text-charcoal sm:relative sm:top-auto sm:right-auto sm:left-auto sm:text-right lg:absolute lg:top-[28.7%] lg:left-[56.2%] lg:w-[42%]">
          <h1
            className="text-[clamp(21px,5.75vw,24px)] leading-[1.02] font-extrabold tracking-[-0.045em] animate-[projects-rise-in_.8s_.55s_cubic-bezier(.22,1,.36,1)_both] motion-reduce:animate-none sm:text-[clamp(34px,2.8vw,68px)] sm:leading-[1.12] sm:font-bold"
          >
            {projectHeroTitleLines[0]}
            <br />
            {projectHeroTitleLines[1]}
          </h1>
          <Image
            src="/images/projects/section-rule.png"
            alt=""
            width={1388}
            height={128}
            className="mt-[10px] h-auto w-[150px] animate-[projects-slide-from-right_.75s_.88s_cubic-bezier(.22,1,.36,1)_both] motion-reduce:animate-none sm:mt-[4.4%] sm:ml-auto sm:w-[48%] sm:-scale-x-100"
            aria-hidden="true"
          />
          <p
            className="mt-[8px] max-w-[350px] text-justify text-[11px] leading-[1.27] font-normal tracking-[-0.018em] [text-align-last:auto] animate-[projects-slide-from-right_.82s_1.08s_cubic-bezier(.22,1,.36,1)_both] motion-reduce:animate-none sm:mt-[3.3%] sm:ml-auto sm:max-w-[44rem] sm:text-[clamp(17px,1.12vw,28px)] sm:leading-[1.38] sm:[text-align-last:right]"
          >
            <Image
              src="/images/projects/mobile/hero-inline-house.png"
              alt=""
              width={113}
              height={119}
              className="mr-[5px] inline-block h-[0.95em] w-auto align-[-0.12em] sm:hidden"
              aria-hidden="true"
            />
            <HighlightedCopy
              copy={projectsPageHeroContent.description}
              highlights={[
                "thiết kế thi công",
                "BMT Decor.",
                "cải tạo trọn gói, thi công nội thất và sửa chữa nhà,",
              ]}
            />
          </p>
        </div>
      </div>
    </section>
  );
}

function HighlightedCopy({
  copy,
  highlights,
}: {
  copy: string;
  highlights: string[];
}) {
  const parts: React.ReactNode[] = [];
  let remainder = copy;

  highlights.forEach((highlight) => {
    const index = remainder.indexOf(highlight);
    if (index < 0) return;
    parts.push(remainder.slice(0, index));
    parts.push(
      <strong className="font-bold" key={highlight}>
        {highlight}
      </strong>,
    );
    remainder = remainder.slice(index + highlight.length);
  });
  parts.push(remainder);

  return <>{parts}</>;
}
