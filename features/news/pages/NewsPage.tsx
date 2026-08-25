"use client";

import Image from "next/image";
import Link from "next/link";
import { BmtCta } from "@/lib/components/shared/BmtCta";
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
import { ListDivider } from "@/lib/components/shared/ListDivider";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { articles, featuredNews, type NewsArticle } from "@/features/news/data/news-page";
import styles from "./NewsPage.module.css";

const desktopPageSize = 5;
const mobileBatchSize = 4;

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

function MoreLink({ href }: { href: string }) {
  return (
    <Link className={styles.articleMoreLink} href={href}>
      Xem chi tiết
      <ArrowUpRight
        className={styles.articleMoreIconDesktop}
        aria-hidden="true"
      />
      <Image
        className={styles.articleMoreIconMobile}
        src="/images/news/mobile/article-link-arrow.png"
        alt=""
        width={28}
        height={97}
        aria-hidden="true"
      />
    </Link>
  );
}

function ArticleCard({
  article,
  showDivider,
}: {
  article: NewsArticle;
  showDivider: boolean;
}) {
  return (
    <div className={styles.articleEntry}>
      {showDivider && (
        <ListDivider />
      )}
      <article className={`group ${styles.articleCard}`}>
        <div className={styles.articleImageWrap}>
          <Image
            className={`${styles.articleImage} ${styles.articleImageDesktop}`}
            src={article.desktopImage}
            alt={article.imageAlt}
            fill
            sizes="300px"
          />
          <Image
            className={`${styles.articleImage} ${styles.articleImageMobile}`}
            src={article.mobileImage}
            alt={article.imageAlt}
            width={3600}
            height={2160}
            sizes="calc(100vw - 28px)"
          />
        </div>
        <div className={styles.articleContent}>
          <h2 className={styles.articleTitle}>{article.title}</h2>
          <p className={styles.articleDescription}>
            {article.excerpt}
          </p>
          <div className={styles.articleContentMore}>
            <MoreLink href={article.href} />
          </div>
        </div>
      </article>
    </div>
  );
}

export function NewsPage() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [mobileVisibleCount, setMobileVisibleCount] =
    useState(mobileBatchSize);
  const [page, setPage] = useState(0);
  const [pendingPage, setPendingPage] = useState<number | null>(null);
  const [isPageLeaving, setIsPageLeaving] = useState(false);

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

  const visibleArticles = useMemo(
    () =>
      articles.slice(
        page * desktopPageSize,
        page * desktopPageSize + desktopPageSize,
      ),
    [page],
  );
  const mobileVisibleArticles = useMemo(
    () => articles.slice(0, mobileVisibleCount),
    [mobileVisibleCount],
  );
  const pageCount = Math.ceil(articles.length / desktopPageSize);

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
      <main
        className="overflow-hidden bg-[#efedef] pt-[60px] xl:pt-[var(--site-header-desktop-height)]"
        data-scroll-snap-page
      >
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

          <div className={styles.newsHeroMobileDecorations} aria-hidden="true">
            <Image
              className={styles.heroMobileEdgePill}
              src="/images/news/mobile/hero-edge-pill.png"
              alt=""
              width={637}
              height={363}
              loading="eager"
            />
            <Image
              className={styles.heroMobileGridCorner}
              src="/images/news/mobile/hero-grid-corner.png"
              alt=""
              width={264}
              height={264}
              loading="eager"
            />
            <Image
              className={styles.heroMobileTitleRule}
              src="/images/news/mobile/hero-title-rule.png"
              alt=""
              width={1388}
              height={128}
              loading="eager"
            />
            <Image
              className={styles.heroMobileGridTop}
              src="/images/news/mobile/hero-grid-top.png"
              alt=""
              width={703}
              height={112}
              loading="eager"
            />
            <Image
              className={styles.heroMobileArchOrange}
              src="/images/news/mobile/hero-arch-orange.png"
              alt=""
              width={872}
              height={1531}
              loading="eager"
            />
            <Image
              className={styles.heroMobileArchGray}
              src="/images/news/mobile/hero-arch-gray.png"
              alt=""
              width={399}
              height={701}
              loading="eager"
            />
            <Image
              className={styles.heroMobileOutlineSquare}
              src="/images/news/mobile/hero-outline-square.png"
              alt=""
              width={1604}
              height={1604}
              loading="eager"
            />
            <Image
              className={styles.heroMobileGrayPanel}
              src="/images/news/mobile/hero-gray-panel.png"
              alt=""
              width={2860}
              height={1755}
              loading="eager"
            />
            <Image
              className={styles.heroMobileBottomArch}
              src="/images/news/mobile/hero-bottom-arch.png"
              alt=""
              width={499}
              height={362}
              loading="eager"
            />
            <Image
              className={styles.heroMobileGridBottom}
              src="/images/news/mobile/hero-grid-bottom.png"
              alt=""
              width={773}
              height={123}
              loading="eager"
            />
          </div>

          <div className={styles.newsHeroCopy}>
            <Image
              className={styles.newsHeroMobileCopyLine}
              src="/images/news/mobile/hero-copy-line.png"
              alt=""
              width={7}
              height={1008}
              aria-hidden="true"
            />
            <p className={styles.newsHeroEyebrow}>KIẾN THỨC</p>
            <h1 className={styles.newsHeroTitle}>
              <span className={styles.newsHeroTitleLine}>THIẾT KẾ &amp;</span>
              <span className={styles.newsHeroTitleLine}> THI CÔNG</span>
            </h1>
            <p className={styles.newsHeroDescription}>
              <Image
                className={`${styles.newsHeroDescriptionIcon} ${styles.newsHeroDescriptionIconDesktop}`}
                src="/images/home/building-mark.png"
                alt=""
                width={110}
                height={116}
                sizes="24px"
                aria-hidden="true"
              />
              <Image
                className={`${styles.newsHeroDescriptionIcon} ${styles.newsHeroDescriptionIconMobile}`}
                src="/images/news/mobile/hero-building-icon.png"
                alt=""
                width={86}
                height={91}
                aria-hidden="true"
              />
              Cập nhật những xu hướng thiết kế nội thất, kinh nghiệm thi công
              xây dựng, cải tạo nhà ở và giải pháp tối ưu không gian từ đội ngũ
              BMT Decor.
            </p>
            <div className={styles.newsHeroCtaSlot}>
              <BmtCta href="/lien-he">
                LIÊN HỆ NGAY
              </BmtCta>
            </div>
          </div>

          <div className={styles.newsHeroPhoto}>
            <Image
              className={`${styles.newsHeroPhotoImage} ${styles.newsHeroPhotoImageDesktop}`}
              src="/images/news/hero-house.jpg"
              alt="Mô hình kiến trúc ngôi nhà trên bản vẽ thiết kế"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, calc(100vw - 36px)"
            />
            <Image
              className={styles.newsHeroPhotoImageMobile}
              src="/images/news/mobile/hero-photo.png"
              alt="Mô hình kiến trúc ngôi nhà trên bản vẽ thiết kế"
              width={3483}
              height={3037}
              priority
              sizes="calc(100vw - 64px)"
            />
          </div>
        </section>

        <section
          className={`${styles.featuredSection} ${styles.featuredSectionVisible}`}
          aria-labelledby="featured-news-title"
        >
          <Image
            className={styles.featuredOrangeShape}
            src="/images/news/mobile/featured-orange-fade.png"
            alt=""
            width={2294}
            height={2542}
            aria-hidden="true"
          />
          <div className={styles.featuredBackdrop} aria-hidden="true">
            <Image
              className={styles.featuredBackdropMobile}
              src="/images/news/mobile/featured-skyline.png"
              alt=""
              width={3884}
              height={384}
            />
          </div>
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
                            className={`${styles.featuredCardImage} ${styles.featuredCardImageDesktop}`}
                            src={item.desktopImage}
                            alt={item.imageAlt}
                            fill
                            loading="eager"
                            sizes="(min-width: 1024px) 37vw, 70vw"
                          />
                          <Image
                            className={styles.featuredCardImageMobile}
                            src={item.mobileImage}
                            alt={item.imageAlt}
                            width={3165}
                            height={1625}
                            loading="eager"
                            sizes="calc(90vw - 32px)"
                          />
                        </div>
                        <div className={styles.featuredCardBody}>
                          <span
                            className={`${styles.featuredBadge} ${index === selectedSlide ? "" : styles.featuredBadgeHidden}`}
                          >
                            <Image
                              className={styles.featuredBadgeAsset}
                              src="/images/news/mobile/featured-badge.png"
                              alt=""
                              fill
                              sizes="50px"
                              aria-hidden="true"
                            />
                            <span>Nổi bật!</span>
                          </span>
                          <h3 className={styles.featuredCardTitle}>
                            {item.title}
                          </h3>
                          <p className={styles.featuredCardDescription}>
                            {item.excerpt}
                          </p>
                          <Image
                            className={styles.featuredDivider}
                            src="/images/news/mobile/featured-divider.png"
                            alt=""
                            width={3176}
                            height={11}
                            aria-hidden="true"
                          />
                          <Link
                            className={styles.featuredMoreLink}
                            href={item.href}
                          >
                            Xem chi tiết
                            <Image
                              className={styles.featuredMoreIcon}
                              src="/images/news/mobile/featured-link-arrow.png"
                              alt=""
                              width={27}
                              height={91}
                              aria-hidden="true"
                            />
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
                      src="/images/news/mobile/featured-previous.png"
                      alt=""
                      width={250}
                      height={250}
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
                      src="/images/news/mobile/featured-next.png"
                      alt=""
                      width={250}
                      height={250}
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
                    >
                      <Image
                        className={styles.featuredDotRing}
                        src={
                          selectedSlide === index
                            ? "/images/news/mobile/featured-dot-active-ring.png"
                            : "/images/news/mobile/featured-dot-inactive.png"
                        }
                        alt=""
                        width={113}
                        height={113}
                        aria-hidden="true"
                      />
                      {selectedSlide === index && (
                        <Image
                          className={styles.featuredDotCenter}
                          src="/images/news/mobile/featured-dot-active-center.png"
                          alt=""
                          width={63}
                          height={63}
                          aria-hidden="true"
                        />
                      )}
                    </button>
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
          <div
            className={`${styles.articleListInner} mx-auto w-[min(1050px,calc(100%-2.25rem))]`}
          >
            <div
              className={`${styles.articlePage} ${styles.desktopArticleList} ${isPageLeaving ? styles.articlePageLeaving : ""}`}
              key={page}
              aria-busy={isPageLeaving}
              aria-live="polite"
            >
              {visibleArticles.map((article, index) => (
                <ArticleReveal delay={120 + index * 45} key={article.id}>
                  <ArticleCard article={article} showDivider={index > 0} />
                </ArticleReveal>
              ))}
            </div>

            <div
              id="mobile-news-list"
              className={`${styles.articlePage} ${styles.mobileArticleList}`}
              aria-live="polite"
            >
              {mobileVisibleArticles.map((article, index) => (
                <ArticleReveal delay={80 + (index % mobileBatchSize) * 45} key={article.id}>
                  <ArticleCard article={article} showDivider={index > 0} />
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

            {mobileVisibleCount < articles.length && (
              <button
                className={styles.articleLoadMore}
                type="button"
                onClick={() =>
                  setMobileVisibleCount((count) =>
                    Math.min(count + mobileBatchSize, articles.length),
                  )
                }
                aria-controls="mobile-news-list"
              >
                <span>Xem thêm</span>
                <Image
                  className={styles.articleLoadMoreIcon}
                  src="/images/news/mobile/load-more-icon.png"
                  alt=""
                  width={237}
                  height={237}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        </section>
      </main>
      <ContactForm showTopNotch />
      <SiteFooter showTopBorder={false} />
    </>
  );
}
