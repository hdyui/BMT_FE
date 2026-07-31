import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
            <div className="grid max-w-2xl grid-cols-[38px_1fr] items-start gap-3">
              <Image
                className="mt-0.5 size-8 object-contain"
                src="/images/home/building-mark.png"
                alt=""
                width={32}
                height={32}
              />
              <p className="text-base leading-[1.62] text-charcoal/85 sm:text-lg">
                Với đội ngũ kiến trúc sư trẻ – năng động đầy sáng tạo, BMT
                Decor luôn mong muốn phát triển và mang đến những thiết kế ấn
                tượng và độc đáo. Là đối tác độc quyền của nhiều thương hiệu
                lớn. Thiết kế và thi công nhiều trung tâm thương mại tại TP.HCM.
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-8" delay={360}>
            <Link
              className="group/button inline-flex items-center gap-5 rounded-full border border-[#ff9f68] bg-brand py-3 pr-3 pl-8 text-xl font-extrabold text-white shadow-[inset_0_1px_0_rgb(255_255_255/.35)] transition-[background-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#ff8a3d] hover:shadow-[0_12px_28px_rgb(244_122_42/.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:text-2xl"
              href="/ho-so-nang-luc"
            >
              XEM THÊM
              <span className="grid size-12 place-items-center rounded-full border-2 border-white/70 transition-transform duration-300 group-hover/button:rotate-6 group-hover/button:scale-105">
                <ArrowUpRight className="size-7" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        </div>

        <PortfolioBooks />
      </div>
    </section>
  );
}
