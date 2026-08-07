"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CarouselApi } from "@/lib/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/lib/components/ui/carousel";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import styles from "./NewsPage.module.css";

const featuredNews = [
  {
    title: "Xu hướng thiết kế nhà ở hiện đại, tối ưu công năng",
    description:
      "Những nguyên tắc giúp không gian sống cân bằng giữa thẩm mỹ, tiện nghi và nhu cầu sử dụng thực tế của gia đình.",
  },
  {
    title: "Kinh nghiệm chuẩn bị trước khi thi công xây dựng",
    description:
      "Từ bản vẽ, vật liệu đến kế hoạch ngân sách: các bước cần thống nhất để công trình được triển khai đúng tiến độ.",
  },
  {
    title: "Giải pháp cải tạo nhà ở bền vững và tiết kiệm",
    description:
      "Cách đánh giá hiện trạng và lựa chọn hạng mục ưu tiên để nâng cấp không gian hiệu quả, hạn chế chi phí phát sinh.",
  },
  {
    title: "Phối hợp kiến trúc và nội thất trong một tổng thể",
    description:
      "Một quy trình thiết kế xuyên suốt giúp vật liệu, ánh sáng và công năng kết nối tự nhiên trong từng không gian.",
  },
  {
    title: "Lựa chọn vật liệu phù hợp với khí hậu Việt Nam",
    description:
      "Những tiêu chí thực tế để vật liệu giữ được vẻ đẹp, độ bền và khả năng bảo trì thuận tiện theo thời gian.",
  },
] as const;

const articles = [
  "5 lưu ý quan trọng khi lập kế hoạch xây dựng nhà ở",
  "Cách tối ưu ánh sáng tự nhiên cho không gian sống",
  "Kinh nghiệm lựa chọn đơn vị thiết kế và thi công trọn gói",
  "Những lỗi thường gặp khi cải tạo nhà cũ",
  "Vật liệu nội thất bền đẹp cho gia đình hiện đại",
  "Bố trí công năng hợp lý cho nhà phố diện tích nhỏ",
  "Quy trình kiểm soát chất lượng trong quá trình thi công",
  "Xu hướng sử dụng màu sắc trong thiết kế nội thất",
  "Giải pháp chống nóng và thông gió cho nhà ở đô thị",
  "Cách dự trù ngân sách thi công sát với thực tế",
  "Không gian mở: khi nào nên sử dụng trong nhà ở?",
  "Các bước nghiệm thu công trình trước khi bàn giao",
  "Thiết kế phòng khách cân bằng thẩm mỹ và tiện nghi",
  "Cải tạo mặt tiền để nâng tầm giá trị công trình",
  "Những tiêu chí chọn vật liệu hoàn thiện lâu bền",
] as const;

const pageSize = 5;

function ArticleReveal({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = revealRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.unobserve(entry.target);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.16 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={revealRef}
      className={`${styles.articleReveal} ${visible ? styles.articleRevealVisible : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function MoreLink() {
  return (
    <Link className={styles.articleMoreLink} href="#contact-form">
      Xem chi tiết
      <ArrowUpRight aria-hidden="true" />
    </Link>
  );
}

export function NewsPage() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [page, setPage] = useState(0);
  const [pendingPage, setPendingPage] = useState<number | null>(null);
  const [isPageLeaving, setIsPageLeaving] = useState(false);
  const [featuredSectionEntered, setFeaturedSectionEntered] = useState(false);
  const featuredSectionRef = useRef<HTMLElement>(null);

  const syncSelectedSlide = useCallback((api: NonNullable<CarouselApi>) => {
    setSelectedSlide(api.selectedScrollSnap());
  }, []);

  const connectCarousel = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCarouselApi(api);
    setSelectedSlide(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("select", syncSelectedSlide);
    carouselApi.on("reInit", syncSelectedSlide);
    return () => {
      carouselApi.off("select", syncSelectedSlide);
      carouselApi.off("reInit", syncSelectedSlide);
    };
  }, [carouselApi, syncSelectedSlide]);

  useEffect(() => {
    const featuredSection = featuredSectionRef.current;
    if (!featuredSection) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setFeaturedSectionEntered(true);
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    revealObserver.observe(featuredSection);
    return () => revealObserver.disconnect();
  }, []);

  const visibleArticles = useMemo(
    () => articles.slice(page * pageSize, page * pageSize + pageSize),
    [page],
  );
  const pageCount = Math.ceil(articles.length / pageSize);

  useEffect(() => {
    if (!isPageLeaving || pendingPage === null) return;

    const transitionTimer = window.setTimeout(() => {
      setPage(pendingPage);
      setPendingPage(null);
      setIsPageLeaving(false);
    }, 280);

    return () => window.clearTimeout(transitionTimer);
  }, [isPageLeaving, pendingPage]);

  function changePage(nextPage: number) {
    if (
      isPageLeaving ||
      nextPage === page ||
      nextPage < 0 ||
      nextPage >= pageCount
    ) {
      return;
    }

    setPendingPage(nextPage);
    setIsPageLeaving(true);
  }

  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-[#efedef] pt-[85px]">
        <section className={styles.newsHero}>
          <div className={styles.newsHeroDecorations} aria-hidden="true">
            <span
              className={`${styles.heroDecoration} ${styles.heroDecor01}`}
            />
            <span className={`${styles.heroDecoration} ${styles.heroDecor02}`}>
              <i />
              <i />
              <i />
              <i />
            </span>
            <span
              className={`${styles.heroDecoration} ${styles.heroDecor03}`}
            />
            <span
              className={`${styles.heroDecoration} ${styles.heroDecor04}`}
            />
            <span
              className={`${styles.heroDecoration} ${styles.heroDecor05}`}
            />
            <span
              className={`${styles.heroDecoration} ${styles.heroDecor06}`}
            />
            <span className={`${styles.heroDecoration} ${styles.heroDecor07}`}>
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className={`${styles.heroDecoration} ${styles.heroDecor08}`}>
              <i />
              <i />
              <i />
              <i />
            </span>
            <span
              className={`${styles.heroDecoration} ${styles.heroDecor09}`}
            />
          </div>

          <div className={styles.newsHeroCopy}>
            <p className={styles.newsHeroEyebrow}>KIẾN THỨC</p>
            <h1 className={styles.newsHeroTitle}>
              <span className={styles.newsHeroTitleLine}>THIẾT KẾ &amp;</span>
              <span className={styles.newsHeroTitleLine}>THI CÔNG</span>
            </h1>
            <p className={styles.newsHeroDescription}>
              <Image
                className={styles.newsHeroDescriptionIcon}
                src="/images/home/building-mark.png"
                alt=""
                width={110}
                height={116}
                sizes="24px"
                aria-hidden="true"
              />
              Cập nhật những xu hướng thiết kế nội thất, kinh nghiệm thi công
              xây dựng, cải tạo nhà ở và giải pháp tối ưu không gian từ đội ngũ
              BMT Decor.
            </p>
            <Link className={styles.newsHeroCta} href="/lien-he">
              <span>LIÊN HỆ NGAY</span>
            </Link>
          </div>

          <div className={styles.newsHeroPhoto}>
            <Image
              className={styles.newsHeroPhotoImage}
              src="/images/news/hero-house.jpg"
              alt="Mô hình kiến trúc ngôi nhà trên bản vẽ thiết kế"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, calc(100vw - 36px)"
            />
          </div>
        </section>

        <section
          ref={featuredSectionRef}
          className={`${styles.featuredSection} ${featuredSectionEntered ? styles.featuredSectionVisible : ""}`}
          aria-labelledby="featured-news-title"
        >
          <div className={styles.featuredBackdrop} aria-hidden="true" />
          <div className={styles.featuredInner}>
            <div className={styles.featuredHeadingWrap}>
              <h2 id="featured-news-title" className={styles.featuredHeading}>
                TIN TỨC NỔI BẬT
              </h2>
            </div>

            <div className={styles.featuredCarouselArea}>
              <Carousel
                setApi={connectCarousel}
                opts={{ align: "center", loop: true }}
                aria-label="Tin tức nổi bật"
              >
                <CarouselContent className={styles.featuredCarouselContent}>
                  {featuredNews.map((item, index) => (
                    <CarouselItem
                      className={styles.featuredCarouselItem}
                      key={item.title}
                    >
                      <article
                        className={`${styles.featuredCard} ${index === selectedSlide ? styles.featuredCardActive : ""}`}
                      >
                        <div className={styles.featuredImageWrap}>
                          <Image
                            className={styles.featuredCardImage}
                            src="/images/news/article-model.jpg"
                            alt="Mô hình kiến trúc trên bản vẽ thiết kế"
                            fill
                            loading="eager"
                            sizes="(min-width: 1024px) 37vw, 70vw"
                          />
                        </div>
                        <div className={styles.featuredCardBody}>
                          <span
                            className={`${styles.featuredBadge} ${index === selectedSlide ? "" : styles.featuredBadgeHidden}`}
                          >
                            Nổi bật!
                          </span>
                          <h3 className={styles.featuredCardTitle}>
                            {item.title}
                          </h3>
                          <p className={styles.featuredCardDescription}>
                            {item.description}
                          </p>
                          <Link
                            className={styles.featuredMoreLink}
                            href="#contact-form"
                          >
                            Xem chi tiết <ArrowUpRight aria-hidden="true" />
                          </Link>
                        </div>
                      </article>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <div className={styles.featuredNav}>
                  <button
                    className={styles.featuredNavButton}
                    type="button"
                    onClick={() => carouselApi?.scrollPrev()}
                    aria-label="Tin trước"
                  >
                    <Image
                      className={styles.featuredNavIcon}
                      src="/images/news/featured-previous.jpg"
                      alt=""
                      width={208}
                      height={208}
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    className={styles.featuredNavButton}
                    type="button"
                    onClick={() => carouselApi?.scrollNext()}
                    aria-label="Tin tiếp theo"
                  >
                    <Image
                      className={styles.featuredNavIcon}
                      src="/images/news/featured-next.jpg"
                      alt=""
                      width={208}
                      height={208}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div
                  className={styles.featuredDots}
                  aria-label="Chọn tin nổi bật"
                >
                  {featuredNews.map((item, index) => (
                    <button
                      className={`${styles.featuredDot} ${selectedSlide === index ? styles.featuredDotActive : ""}`}
                      type="button"
                      onClick={() => carouselApi?.scrollTo(index)}
                      aria-label={`Xem tin ${index + 1}: ${item.title}`}
                      aria-current={
                        selectedSlide === index ? "true" : undefined
                      }
                      key={item.title}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
          </div>
        </section>

        <section
          className={`${styles.articleListSection} bg-white pt-10 pb-20 lg:pt-12 lg:pb-28`}
          aria-label="Danh sách tin tức"
        >
          <div className="mx-auto w-[min(1050px,calc(100%-2.25rem))]">
            <div
              className={`${styles.articlePage} ${isPageLeaving ? styles.articlePageLeaving : ""}`}
              key={page}
              aria-busy={isPageLeaving}
              aria-live="polite"
            >
              {visibleArticles.map((title, index) => (
                <ArticleReveal delay={120 + index * 45} key={title}>
                  <div className={styles.articleEntry}>
                    {index > 0 && (
                      <Image
                        className={styles.articleDivider}
                        src="/images/news/article-divider.jpg"
                        alt=""
                        width={5010}
                        height={123}
                        aria-hidden="true"
                      />
                    )}
                    <article className="group grid gap-6 py-5 sm:grid-cols-[300px_1fr] lg:grid-cols-[300px_1fr] lg:gap-5">
                      <div className="relative aspect-[1.38/1] overflow-hidden rounded-[20px]">
                        <Image
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
                          src="/images/news/article-model.jpg"
                          alt="Mô hình kiến trúc minh họa cho bài viết"
                          fill
                          sizes="(min-width: 640px) 300px, 100vw"
                        />
                      </div>
                      <div className="flex flex-col justify-center py-1">
                        <h2 className="text-[clamp(20px,1.7vw,25px)] leading-[1.08] font-bold tracking-[-0.02em] text-charcoal transition-colors duration-300 group-hover:text-brand">
                          {title}
                        </h2>
                        <p className="mt-4 text-[15px] leading-[1.3] text-neutral-600">
                          BMT Decor chia sẻ góc nhìn thực tế từ quá trình thiết
                          kế và thi công, giúp gia chủ chủ động hơn trong từng
                          quyết định về công năng, vật liệu và ngân sách.
                        </p>
                        <div className="mt-4">
                          <MoreLink />
                        </div>
                      </div>
                    </article>
                  </div>
                </ArticleReveal>
              ))}
            </div>

            <nav
              className={styles.articlePagination}
              aria-label="Phân trang tin tức"
            >
              <button
                className={styles.articlePageButton}
                type="button"
                onClick={() => changePage(page - 1)}
                disabled={page === 0 || isPageLeaving}
              >
                <Image
                  className={styles.articlePageButtonIcon}
                  src="/images/news/page-previous.jpg"
                  alt=""
                  width={104}
                  height={104}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">PREVIOUS PAGE</span>
                <span className="sm:hidden">TRƯỚC</span>
              </button>
              <span className={styles.articlePageIndicator}>
                Page {page + 1}/{pageCount}
              </span>
              <button
                className={`${styles.articlePageButton} ${styles.articlePageButtonNext}`}
                type="button"
                onClick={() => changePage(page + 1)}
                disabled={page === pageCount - 1 || isPageLeaving}
              >
                <span className="hidden sm:inline">NEXT PAGE</span>
                <span className="sm:hidden">SAU</span>
                <Image
                  className={styles.articlePageButtonIcon}
                  src="/images/news/page-next.jpg"
                  alt=""
                  width={104}
                  height={104}
                  aria-hidden="true"
                />
              </button>
            </nav>
          </div>
        </section>
      </main>
      <ContactForm />
      <SiteFooter />
    </>
  );
}
