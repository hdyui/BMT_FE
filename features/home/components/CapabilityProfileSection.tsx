import Image from "next/image";
import Link from "next/link";
import portfolioBook from "@/features/home/assets/portfolio-book.png";
import { Reveal } from "@/lib/components/shared/Reveal";

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

function PortfolioBooks() {
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
              src={portfolioBook}
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

export function CapabilityProfileSection() {
  return (
    <section className="py-16 max-sm:pt-12 lg:py-20">
      <div className="mx-auto grid w-[min(1200px,calc(100%-2.25rem))] items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-6 max-sm:w-[calc(100%-2rem)] max-sm:gap-4">
        <div>
          <Reveal>
            <h2 className="text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold uppercase leading-none tracking-[-0.035em] text-charcoal max-sm:text-[26px]">
              Hồ sơ năng lực
            </h2>
          </Reveal>

          <Reveal delay={130}>
            <p className="mt-3 text-justify text-base leading-relaxed text-charcoal/80 [text-align-last:left] [text-justify:inter-word] sm:text-lg lg:text-xl max-sm:text-[15px] max-sm:leading-[1.25]">
              Đơn vị thiết kế thi công kiến trúc và nội thất, ngoại thất chuyên
              nghiệp tại Việt Nam
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
              Với đội ngũ kiến trúc sư trẻ – năng động đầy sáng tạo, BMT Decor
              luôn mong muốn phát triển và mang đến những thiết kế ấn tượng và
              độc đáo. Là đối tác độc quyền của nhiều thương hiệu lớn. Thiết kế
              và thi công nhiều trung tâm thương mại tại TP.HCM.
            </p>
          </Reveal>

          <Reveal className="mt-8 max-sm:mt-6" delay={360}>
            <Link className="home-contact-cta" href="/ho-so-nang-luc">
              <span className="inline-flex h-full w-4/5 items-center justify-center">
                XEM THÊM
              </span>
            </Link>
          </Reveal>
        </div>

        <PortfolioBooks />
      </div>
    </section>
  );
}
