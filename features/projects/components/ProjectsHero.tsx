import Image from "next/image";
import styles from "./ProjectsHero.module.css";

export function ProjectsHero() {
  return (
    <section
      className={`relative z-[1] isolate min-h-[650px] overflow-hidden bg-[#f2f2f4] lg:h-[calc(39.0625vw+40px)] lg:min-h-0 ${styles.heroSection}`}
    >
      <Image
        src="/images/projects/hero-blueprint.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={`pointer-events-none z-0 hidden object-fill lg:block ${styles.heroBackdrop}`}
        aria-hidden="true"
      />

      <Image
        src="/images/projects/hero-blueprint.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={`pointer-events-none z-[5] hidden object-fill lg:block ${styles.heroHeaderTail}`}
        aria-hidden="true"
      />

      <Image
        src="/images/projects/hero-blueprint.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={`pointer-events-none z-[2] hidden object-fill lg:block ${styles.heroDotOverlay}`}
        aria-hidden="true"
      />

      <div
        className={`pointer-events-none absolute top-[6%] left-[3.6%] z-[1] hidden h-[68%] w-[30%] rounded-tl-[4.5rem] bg-[#d5d5d5] lg:block ${styles.heroGrayBlock}`}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute top-[9%] left-[9.2%] z-10 hidden aspect-[2000/1700] w-[37.7%] overflow-hidden rounded-tl-[5.4rem] rounded-br-[5.4rem] lg:block">
        <Image
          src="/images/projects/hero-plans.png"
          alt="Kiến trúc sư làm việc trên bản vẽ công trình"
          fill
          priority
          sizes="38vw"
          className={`object-cover ${styles.heroPhoto}`}
        />
      </div>

      <div
        className={`pointer-events-none absolute top-[57.6%] left-[33.2%] z-[15] hidden h-[38.2%] w-[18.5%] lg:block ${styles.heroOutline}`}
        aria-hidden="true"
      >
        <span className={styles.heroOutlineFrame} />
        <span className={styles.heroOutlineDot} />
      </div>

      <div className="mx-auto grid min-h-[650px] w-[min(1380px,calc(100%-2.25rem))] items-center gap-10 py-12 lg:block lg:min-h-0 lg:w-full lg:py-0">
        <div
          className={`relative aspect-[1.12/1] overflow-hidden rounded-tl-[4.5rem] rounded-br-[4.5rem] lg:hidden ${styles.heroArtwork}`}
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

        <div className="relative z-30 text-right text-charcoal lg:absolute lg:top-[28.7%] lg:left-[56.2%] lg:w-[42%]">
          <h1
            className={`text-[clamp(34px,2.8vw,68px)] leading-[1.12] font-bold tracking-[-0.04em] ${styles.heroTitle}`}
          >
            MỖI CÔNG TRÌNH
            <br />
            MỘT CAM KẾT CHẤT LƯỢNG
          </h1>
          <Image
            src="/images/projects/section-rule.png"
            alt=""
            width={1388}
            height={128}
            className={`mt-[4.4%] ml-auto h-auto w-[48%] -scale-x-100 ${styles.heroRule}`}
            aria-hidden="true"
          />
          <p
            className={`mt-[3.3%] ml-auto max-w-[44rem] text-[clamp(17px,1.12vw,28px)] leading-[1.38] font-normal tracking-[-0.018em] ${styles.heroCopy}`}
          >
            Mỗi dự án là minh chứng cho năng lực{" "}
            <strong className="font-bold">thiết kế thi công</strong> và sự tận tâm
            của <strong className="font-bold">BMT Decor.</strong> Từ những công
            trình xây mới đến các dự án{" "}
            <strong className="font-bold">
              cải tạo trọn gói, thi công nội thất và sửa chữa nhà,
            </strong>{" "}
            chúng tôi luôn đồng hành cùng khách hàng từ ý tưởng đến hoàn thiện,
            tạo nên những không gian bền vững, thẩm mỹ và phù hợp với nhu cầu sử
            dụng thực tế.
          </p>
        </div>
      </div>
    </section>
  );
}
