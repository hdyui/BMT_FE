import Image from "next/image";
import { BmtCta } from "@/shared/components/BmtCta";
import { Reveal } from "@/shared/components/Reveal";
import type { HomeProfileSection } from "@/features/home/types/home-public";

const portfolioBooks = [
  {
    position: "left-0",
    layer: "z-30",
    delay: 100,
  },
  {
    position: "left-[18%]",
    layer: "z-20",
    delay: 380,
  },
  {
    position: "left-[44.5%]",
    layer: "z-10",
    delay: 660,
  },
] as const;

function PortfolioBooks({ image }: { image: string }) {
  return (
    <div
      className="group relative mx-auto aspect-[1453/1256] w-full max-w-[560px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none max-sm:max-w-[300px]"
      role="img"
      aria-label="Bộ hồ sơ năng lực BMT Decor gồm ba quyển portfolio"
    >
      {portfolioBooks.map((book) => (
        <Reveal
          className={`pointer-events-none absolute top-0 h-full w-[55.54%] data-[visible=false]:translate-x-[45%] ${book.position} ${book.layer}`}
          delay={book.delay}
          duration={900}
          distance="long"
          from="right"
          key={book.position}
        >
          <div className="relative h-full w-full">
            <Image
              className="object-contain"
              src={image}
              alt=""
              fill
              sizes="(max-width: 639px) 48vw, (max-width: 1023px) 36vw, 26vw"
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function CapabilityProfileSection({
  content,
}: {
  content: HomeProfileSection;
}) {
  const oneBookImage =
    content.oneBookImage || "/images/home/portfolio-book.png";

  return (
    <section className="py-16 max-sm:pt-12 lg:py-20">
      <div className="mx-auto grid w-[min(1200px,calc(100%-2.25rem))] items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-6 max-sm:w-[calc(100%-2rem)] max-sm:gap-4">
        <div>
          <Reveal>
            <h2 className="text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold uppercase leading-none tracking-[-0.035em] text-charcoal max-sm:text-[26px]">
              {content.title}
            </h2>
          </Reveal>

          <Reveal delay={130}>
            <p className="mt-3 text-justify text-base leading-relaxed text-charcoal/80 [text-align-last:left] [text-justify:inter-word] sm:text-lg lg:text-xl max-sm:text-[15px] max-sm:leading-[1.25]">
              {content.subtitle}
            </p>
          </Reveal>

          <Reveal className="mt-8 max-sm:mt-4" delay={240} from="left">
            <p className="max-w-2xl text-justify text-xl leading-[1.62] text-charcoal/85 [text-align-last:left] [text-justify:inter-word] sm:text-lg max-sm:text-[15px] max-sm:leading-[1.12]">
              <Image
                className="float-left mr-3 size-7 object-contain max-sm:mt-[2px] max-sm:mr-2 max-sm:size-[14px]"
                src="/images/home/building-mark.png"
                alt=""
                width={28}
                height={28}
              />
              {content.description}
            </p>
          </Reveal>

          <Reveal className="mt-8 max-sm:mt-6" delay={360}>
            <div className="max-sm:-translate-y-10">
              <BmtCta
                className="max-sm:min-h-10 max-sm:w-[158px] max-sm:text-[17px]"
                href="/capability-profile"
              >
                XEM THÊM
              </BmtCta>
            </div>
          </Reveal>
        </div>

        <PortfolioBooks image={oneBookImage} />
      </div>
    </section>
  );
}
