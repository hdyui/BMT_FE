import { services as serviceLinks } from "@/shared/constants/site";
import {
  homeHeroSlides,
  homeSectionContent,
  homeServiceDetails,
  homeStats,
  homeTrustReasons,
} from "@/features/home/data/home-content";
import type {
  HomeNewsItem,
  HomeProjectCategory,
  HomePublicData,
  HomeServiceItem,
} from "@/features/home/types/home-public";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readString(
  record: UnknownRecord | null,
  key: string,
  fallback = "",
): string {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readOptionalString(
  record: UnknownRecord | null,
  key: string,
): string | undefined {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function readNumber(
  record: UnknownRecord | null,
  key: string,
  fallback = 0,
): number {
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

const projectCategoryVisuals = [
  {
    match: "nhà ở",
    label: "NHÀ Ở",
    icon: "/images/home/category-house.png",
    desktopIconClassName: "lg:h-auto lg:w-[44px]",
    slug: "nha-o",
  },
  {
    match: "văn phòng",
    label: "VĂN PHÒNG",
    icon: "/images/home/category-office.png",
    desktopIconClassName: "lg:h-auto lg:w-[39px]",
    slug: "van-phong",
  },
  {
    match: "thẩm mỹ viện, showroom",
    label: "THẨM MỸ VIỆN, SHOWROOM",
    icon: "/images/home/category-showroom.png",
    desktopIconClassName: "lg:h-auto lg:w-[48px]",
    slug: "showroom",
  },
  {
    match: "nhà hàng, khách sạn",
    label: "NHÀ HÀNG, KHÁCH SẠN",
    icon: "/images/home/category-hotel.png",
    desktopIconClassName: "lg:h-auto lg:w-[43px]",
    slug: "hospitality",
  },
] as const;

function createFallbackData(): HomePublicData {
  const fallbackServices: HomeServiceItem[] = serviceLinks.map(
    (service, index) => ({
      label: service.label,
      href: service.href,
      image: homeServiceDetails[index]?.image ?? "",
      desktopImage: homeServiceDetails[index]?.desktopImage ?? "",
      copy: homeServiceDetails[index]?.copy ?? "",
    }),
  );

  return {
    heroSlides: homeHeroSlides.map((slide) => ({
      ...slide,
      mobileImage: slide.image,
    })),
    trustIntro: {
      titleDesktop: "Vì sao khách hàng tin chọn BMT Decor?",
      titleMobile: "Vì sao khách hàng tin chọn",
      descriptionDesktop:
        "Với tư duy thiết kế sáng tạo và quy trình thi công bài bản, chúng tôi kiến tạo những không gian hài hòa giữa thẩm mỹ, công năng và giá trị sử dụng bền vững.",
      descriptionMobile:
        "Với tư duy thiết kế luôn đổi mới trong sáng tạo và quy trình thi công bài bản, chúng tôi kiến tạo nên những không gian có giá trị thẩm mỹ cao cấp, tối ưu công năng một cách tuyệt đối và có độ bền vững theo thời gian cho không gian sống.",
    },
    trustReasons: homeTrustReasons.map((reason, index) => ({
      ...reason,
      mobileImage: [
        "/images/home/mobile-trust-team-normal.png",
        "/images/home/mobile-trust-process-normal.png",
        "/images/home/mobile-trust-turnkey-normal.png",
        "/images/home/mobile-trust-quality-normal.png",
      ][index],
      mobileActiveImage: [
        "/images/home/mobile-trust-team-active.png",
        "/images/home/mobile-trust-process-active.png",
        "/images/home/mobile-trust-turnkey-active.png",
        "/images/home/mobile-trust-quality-active.png",
      ][index],
    })),
    stats: homeStats.map((stat) => ({ ...stat, suffix: "+" })),
    featuredProjects: {
      title: homeSectionContent.featuredProjects.title,
      description: homeSectionContent.featuredProjects.description,
    },
    projectCategories: [],
    featuredServices: {
      title: homeSectionContent.featuredServices.title,
      description: homeSectionContent.featuredServices.description,
    },
    services: fallbackServices,
    profileSection: {
      title: "Hồ sơ năng lực",
      subtitle:
        "Đơn vị thiết kế thi công kiến trúc và nội thất, ngoại thất chuyên nghiệp tại Việt Nam",
      description:
        "Với đội ngũ kiến trúc sư trẻ – năng động đầy sáng tạo, BMT Decor luôn mong muốn phát triển và mang đến những thiết kế ấn tượng và độc đáo. Là đối tác độc quyền của nhiều thương hiệu lớn. Thiết kế và thi công nhiều trung tâm thương mại tại TP.HCM.",
      oneBookImage: "/images/home/portfolio-book.png",
      threeBooksImage: "/images/home/portfolio-set-orange.png",
    },
    featuredNewsTitle: homeSectionContent.featuredNews.title,
    highlightedNews: [],
    contactForm: {
      title: "LIÊN HỆ TƯ VẤN",
      successMessage:
        "Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ liên hệ với bạn trong thời gian sớm nhất.",
    },
  };
}

function mapHero(
  source: unknown,
  fallback: HomePublicData["heroSlides"],
): HomePublicData["heroSlides"] {
  const items = asArray(source);
  if (items.length === 0) return fallback;

  const mapped = items
    .map((item, index) => {
      const record = asRecord(item);
      const currentFallback = fallback[index] ?? fallback[0];
      if (!record || !currentFallback) return null;

      const desktopImage = readString(
        record,
        "desktopImage",
        currentFallback.image,
      );

      return {
        image: desktopImage,
        mobileImage:
          readOptionalString(record, "mobileImage") ??
          currentFallback.mobileImage ??
          desktopImage,
        alt: currentFallback.alt,
        title: readString(record, "title", currentFallback.title),
        copy: readString(record, "description", currentFallback.copy),
        href: currentFallback.href,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return mapped.length > 0 ? mapped : fallback;
}

function mapProjectCategories(
  categoriesSource: unknown,
  projectsSource: unknown,
): HomeProjectCategory[] {
  const apiCategories = asArray(categoriesSource)
    .map(asRecord)
    .filter((item): item is UnknownRecord => Boolean(item));
  const featuredProjects = asArray(projectsSource)
    .map(asRecord)
    .filter(
      (item): item is UnknownRecord =>
        Boolean(item) && item?.isFeatured === true,
    );

  return apiCategories.flatMap((category, categoryIndex) => {
    const categoryId = readString(category, "id");
    const categoryName = readString(category, "name");
    if (!categoryId || !categoryName) return [];

    const visual =
      projectCategoryVisuals.find(
        (item) => item.match === categoryName.trim().toLowerCase(),
      ) ?? {
        label: categoryName.toUpperCase(),
        icon: "/images/home/category-house.png",
        desktopIconClassName: "lg:h-auto lg:w-[44px]",
        slug: `category-${categoryIndex + 1}`,
      };

    const projects = featuredProjects
      .filter(
        (project) =>
          readString(project, "categoryId") === categoryId ||
          readString(project, "categoryName") === categoryName,
      )
      .slice(0, 8)
      .map((project, projectIndex) => ({
        id: readString(
          project,
          "id",
          `${visual.slug}-${projectIndex + 1}`,
        ),
        image: readString(project, "imageUrl"),
        title: readString(project, "title"),
        area: readString(project, "area"),
        style: readString(project, "style"),
        year: readNumber(project, "year"),
        href: `/projects/${readString(project, "slug")}`,
      }))
      .filter((project) => project.image && project.title);

    return [
      {
        label: visual.label,
        icon: visual.icon,
        desktopIconClassName: visual.desktopIconClassName,
        slug: visual.slug,
        projects,
      },
    ];
  });
}

function mapNews(
  source: unknown,
): HomeNewsItem[] {
  const items = asArray(source).filter((item) => {
    const record = asRecord(item);
    return record?.highlightHome === true;
  });
  if (items.length === 0) return [];

  return items.slice(0, 4).flatMap((item, index) => {
    const record = asRecord(item);
    if (!record) return [];

    const imageUrl = readOptionalString(record, "imageUrl");
    const slug = readString(record, "slug", `home-news-${index + 1}`);
    const title = readString(record, "title");
    if (!imageUrl || !title) return [];

    return [
      {
        id: readString(record, "id", `home-news-${index + 1}`),
        slug,
        title,
        excerpt: readString(record, "excerpt"),
        desktopImage: imageUrl,
        mobileImage: imageUrl,
        imageAlt: title,
        href: `/news#${slug}`,
      },
    ];
  });
}

export function buildHomePublicData({
  homeApiValue,
  newsApiValue,
  projectsApiValue,
  projectCategoriesApiValue,
  fallbackData,
}: {
  homeApiValue?: unknown;
  newsApiValue?: unknown;
  projectsApiValue?: unknown;
  projectCategoriesApiValue?: unknown;
  fallbackData?: HomePublicData;
}): HomePublicData {
  const fallback = fallbackData ?? createFallbackData();
  const homeValue = asRecord(homeApiValue);
  const nestedContent = asRecord(homeValue?.content);
  const content = nestedContent ?? homeValue;

  const whyBmt = asRecord(content?.whyBmt);
  const statistics = asArray(content?.statistics);
  const featuredProjects = asRecord(content?.featuredProjects);
  const featuredServices = asRecord(content?.featuredServices);
  const profileSection = asRecord(content?.profileSection);
  const contactForm = asRecord(content?.contactForm);

  const trustItems = asArray(whyBmt?.items);
  const trustReasons =
    trustItems.length > 0
      ? trustItems.map((item, index) => {
          const record = asRecord(item);
          const currentFallback =
            fallback.trustReasons[index] ?? fallback.trustReasons[0];
          const defaultImage = readString(
            record,
            "defaultImage",
            currentFallback?.desktopImage ?? "",
          );
          const mobileImage =
            readOptionalString(record, "mobileImage") ??
            currentFallback?.mobileImage ??
            defaultImage;

          return {
            image: mobileImage,
            desktopImage: defaultImage,
            desktopHoverImage: defaultImage,
            mobileImage,
            mobileActiveImage: mobileImage,
            icon: currentFallback?.icon ?? "",
            title: readString(record, "title", currentFallback?.title ?? ""),
            copy: readString(
              record,
              "description",
              currentFallback?.copy ?? "",
            ),
          };
        })
      : fallback.trustReasons;

  const stats =
    statistics.length > 0
      ? statistics.map((item, index) => {
          const record = asRecord(item);
          const currentFallback = fallback.stats[index] ?? fallback.stats[0];
          return {
            value: readNumber(record, "value", currentFallback?.value ?? 0),
            label: readString(record, "label", currentFallback?.label ?? ""),
            suffix:
              readOptionalString(record, "suffix") ??
              currentFallback?.suffix,
          };
        })
      : fallback.stats;

  const serviceApiItems = asArray(featuredServices?.items);
  const mappedServices =
    serviceApiItems.length > 0
      ? fallback.services.map((service, index) => {
          const record = asRecord(serviceApiItems[index]);
          if (!record) return service;
          return {
            ...service,
            label: readString(record, "title", service.label),
            copy: readString(record, "description", service.copy),
            desktopImage: readString(
              record,
              "desktopImage",
              service.desktopImage,
            ),
            image:
              readOptionalString(record, "mobileImage") ??
              readString(record, "desktopImage", service.image),
          };
        })
      : fallback.services;

  return {
    ...fallback,
    heroSlides: mapHero(
      homeValue?.hero ?? content?.hero,
      fallback.heroSlides,
    ),
    trustIntro: whyBmt
      ? {
          titleDesktop: readString(
            whyBmt,
            "titleDesktop",
            fallback.trustIntro.titleDesktop,
          ),
          titleMobile: readString(
            whyBmt,
            "titleMobile",
            fallback.trustIntro.titleMobile,
          ),
          descriptionDesktop: readString(
            whyBmt,
            "descriptionDesktop",
            fallback.trustIntro.descriptionDesktop,
          ),
          descriptionMobile: readString(
            whyBmt,
            "descriptionMobile",
            fallback.trustIntro.descriptionMobile,
          ),
        }
      : fallback.trustIntro,
    trustReasons,
    stats,
    featuredProjects: featuredProjects
      ? {
          title: readString(
            featuredProjects,
            "title",
            fallback.featuredProjects.title,
          ),
          description: readString(
            featuredProjects,
            "description",
            fallback.featuredProjects.description,
          ),
        }
      : fallback.featuredProjects,
    projectCategories: mapProjectCategories(
      projectCategoriesApiValue,
      projectsApiValue,
    ),
    featuredServices: featuredServices
      ? {
          title: readString(
            featuredServices,
            "title",
            fallback.featuredServices.title,
          ),
          description: readString(
            featuredServices,
            "description",
            fallback.featuredServices.description,
          ),
        }
      : fallback.featuredServices,
    services: mappedServices,
    profileSection: profileSection
      ? {
          title: readString(
            profileSection,
            "title",
            fallback.profileSection.title,
          ),
          subtitle: readString(
            profileSection,
            "subtitle",
            fallback.profileSection.subtitle,
          ),
          description: readString(
            profileSection,
            "description",
            fallback.profileSection.description,
          ),
          oneBookImage: readOptionalString(profileSection, "oneBookImage"),
          threeBooksImage: readOptionalString(
            profileSection,
            "threeBooksImage",
          ),
        }
      : fallback.profileSection,
    highlightedNews: mapNews(newsApiValue),
    contactForm: contactForm
      ? {
          title: readString(
            contactForm,
            "title",
            fallback.contactForm.title,
          ),
          subtitle: readOptionalString(contactForm, "subtitle"),
          successMessage: readString(
            contactForm,
            "successMessage",
            fallback.contactForm.successMessage,
          ),
        }
      : fallback.contactForm,
  };
}
