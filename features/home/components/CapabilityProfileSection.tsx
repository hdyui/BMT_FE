import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/lib/components/shared/Reveal";

const portfolioSlices = [
  {
    clipPath: "inset(0 0 0 66.5%)",
    delay: 100,
  },
  {
    clipPath: "inset(0 33.25% 0 33.25%)",
    delay: 230,
  },
  {
    clipPath: "inset(0 66.5% 0 0)",
    delay: 360,
  },
] as const;

function PortfolioBooks() {
  return (
    <div
      className="group relative mx-auto aspect-[1546/1221] w-full max-w-[560px] transition-transform duration-500 ease-out hover:scale-[1.035]"
      role="img"
      aria-label="Bộ hồ sơ năng lực BMT Decor gồm ba quyển portfolio"
    >
      {portfolioSlices.map((slice) => (
        <Reveal
          className="absolute inset-0"
          delay={slice.delay}
          from="right"
          key={slice.clipPath}
        >
          <Image
            className="object-contain"
            src="/images/home/portfolio-set.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            style={{ clipPath: slice.clipPath }}
          />
        </Reveal>
      ))}
    </div>
  );
}

export function CapabilityProfileSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto grid w-[min(1200px,calc(100%-2.25rem))] items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-6">
        <div>
          <Reveal>
            <h2 className="text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold uppercase leading-none tracking-[-0.035em] text-charcoal">
              Hồ sơ năng lực
            </h2>
          </Reveal>

          <Reveal delay={130}>
            <p className="mt-3 text-base leading-relaxed text-charcoal/80 sm:text-lg lg:text-xl">
              Đơn vị thiết kế thi công kiến trúc và nội thất, ngoại thất chuyên
              nghiệp tại Việt Nam
            </p>
          </Reveal>

          <Reveal className="mt-8" delay={240} from="left">
            <p className="max-w-2xl text-xl leading-[1.62] text-charcoal/85 sm:text-lg">
              <Image
                className="float-left mr-3 size-7 object-contain"
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

          <Reveal className="mt-8" delay={360}>
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
