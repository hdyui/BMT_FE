import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/lib/components/shared/Reveal";
import styles from "./CareersHero.module.css";

const heroParts = [
  {
    src: "/images/careers/hero-parts/part-14.jpg",
    className: "left-[1.3625%] top-[4.6713%] w-[10.775%]",
    width: 862,
    height: 801,
  },
  {
    src: "/images/careers/hero-parts/part-12.jpg",
    className: "left-[86.475%] top-0 w-[13.525%]",
    width: 1082,
    height: 908,
  },
  {
    src: "/images/careers/hero-parts/part-13.jpg",
    className: "left-[32.75%] top-[20.1845%] w-[18.6%]",
    width: 1488,
    height: 1243,
  },
  {
    src: "/images/careers/hero-parts/part-15.jpg",
    className: "left-0 top-[52.7105%] w-[22.9625%]",
    width: 1837,
    height: 1640,
  },
  {
    src: "/images/careers/hero-parts/part-16.jpg",
    className: "left-[26.25%] top-[81.0842%] w-[11.3%]",
    width: 904,
    height: 656,
  },
  {
    src: "/images/careers/hero-parts/part-18.jpg",
    className: "left-[50.25%] top-[77.6528%] w-[2.65%]",
    width: 212,
    height: 177,
  },
  {
    src: "/images/careers/hero-parts/part-17.jpg",
    className: "left-[48.95%] top-[84.7751%] w-[6.3375%]",
    width: 507,
    height: 424,
  },
  {
    src: "/images/careers/hero-parts/part-19.jpg",
    className: "left-[63.2625%] top-[86.2745%] w-[1.1875%]",
    width: 95,
    height: 338,
  },
  {
    src: "/images/careers/hero-parts/part-20.jpg",
    className: "left-[94.0625%] top-[80.8535%] w-[5.9375%]",
    width: 475,
    height: 664,
  },
  {
    src: "/images/careers/hero-parts/part-21.jpg",
    className: "left-[96.35%] top-[42.9066%] w-[1.1875%]",
    width: 95,
    height: 418,
  },
] as const;

function CareersHeroBackdrop() {
  return (
    <div
      className="absolute inset-0 hidden overflow-hidden lg:block"
      aria-hidden="true"
    >
      <Image
        className="object-cover"
        src="/images/careers/hero-parts/part-11.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      {heroParts.map((part, index) => (
        <Image
          className={`absolute h-auto mix-blend-darken animate-[fade-in_.65s_ease-out_both] motion-reduce:animate-none ${part.className}`}
          style={{ animationDelay: `${index * 120}ms` }}
          src={part.src}
          alt=""
          width={part.width}
          height={part.height}
          sizes={`${(part.width / 80).toFixed(3)}vw`}
          key={part.src}
        />
      ))}
    </div>
  );
}

function HeroVisual() {
  return (
    <Reveal
      className="relative z-10 mx-auto w-full max-w-[680px] lg:absolute lg:left-[7%] lg:top-[21.5%] lg:max-w-none lg:w-[43.6%]"
      delay={100}
      from="left"
    >
      <div className="group relative aspect-[1.486] w-full overflow-hidden shadow-none transition-shadow duration-500 ease-out hover:shadow-[0_22px_45px_rgba(36,33,34,.24)] [border-top-left-radius:6%_13%] [border-top-right-radius:35%_50%] [border-bottom-right-radius:9%_13%] [border-bottom-left-radius:11%_20%]">
        <Image
          className="animate-[careers-hero-image-enter_1s_cubic-bezier(.22,1,.36,1)_.2s_backwards] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045] motion-reduce:animate-none motion-reduce:transition-none"
          src="/images/careers/hero.png"
          alt="Cái bắt tay trên bản vẽ kiến trúc tại BMT Decor"
          fill
          priority
          sizes="(min-width: 1024px) 46.1vw, calc(100vw - 36px)"
        />
      </div>
    </Reveal>
  );
}

export function CareersHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f7f7f7] lg:aspect-[8000/3468]">
      <CareersHeroBackdrop />

      <div className="relative z-10 mx-auto grid w-[min(1460px,calc(100%-2.25rem))] gap-12 py-16 lg:absolute lg:inset-0 lg:block lg:w-full lg:py-0">
        <HeroVisual />

        <div className="relative z-20 max-w-[640px] lg:absolute lg:left-[55%] lg:top-[24%] lg:w-[39%] lg:max-w-none">
          <Reveal delay={120}>
            <h1 className="text-[clamp(2.8rem,4.6vw,5.1rem)] leading-[.9] font-bold uppercase tracking-[-.045em] text-charcoal">
              Gia nhập đội ngũ
              <Image
                className="mt-3 h-auto w-[clamp(300px,28vw,560px)] max-w-full"
                src="/images/projects/bmt-decor-wordmark.png"
                alt="BMT Decor"
                width={1202}
                height={209}
                priority
              />
            </h1>
          </Reveal>
          <Reveal delay={420} from="left">
            <p className="mt-7 max-w-[620px] text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              Mỗi công trình chất lượng đều bắt đầu từ một đội ngũ tận tâm. Nếu
              bạn yêu thích lĩnh vực thiết kế, kiến trúc và thi công, BMT Decor
              luôn sẵn sàng chào đón bạn đồng hành trên hành trình phát triển
              lâu dài.
            </p>
          </Reveal>
          <div>
            <Link className={styles.careersHeroCta} href="/lien-he">
              LIÊN HỆ NGAY
              <span className={styles.careersHeroCtaIcon}>
                <ArrowUpRight aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
