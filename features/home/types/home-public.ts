export type HomeHeroSlide = {
  image: string;
  mobileImage?: string;
  alt: string;
  title: string;
  copy: string;
  href: string;
};

export type HomeTrustIntroContent = {
  titleDesktop: string;
  titleMobile: string;
  descriptionDesktop: string;
  descriptionMobile: string;
};

export type HomeTrustReason = {
  image: string;
  desktopImage: string;
  desktopHoverImage: string;
  mobileImage?: string;
  mobileActiveImage?: string;
  icon: string;
  title: string;
  copy: string;
};

export type HomeStat = {
  value: number;
  label: string;
  suffix?: string;
};

export type HomeServiceItem = {
  label: string;
  href: string;
  image: string;
  desktopImage: string;
  copy: string;
};

export type HomeProject = {
  id: string;
  image: string;
  title: string;
  area?: string;
  style?: string;
  year?: number;
  href: string;
};

export type HomeProjectCategory = {
  label: string;
  icon: string;
  desktopIconClassName: string;
  slug: string;
  projects: HomeProject[];
};

export type HomeProfileSection = {
  title: string;
  subtitle: string;
  description: string;
  oneBookImage?: string;
  threeBooksImage?: string;
};

export type HomeNewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  desktopImage: string;
  mobileImage: string;
  imageAlt: string;
  href: string;
};

export type HomeContactFormContent = {
  title: string;
  subtitle?: string;
  successMessage: string;
};

export type HomePublicData = {
  heroSlides: HomeHeroSlide[];
  trustIntro: HomeTrustIntroContent;
  trustReasons: HomeTrustReason[];
  stats: HomeStat[];
  featuredProjects: {
    title: string;
    description: string;
  };
  projectCategories: HomeProjectCategory[];
  featuredServices: {
    title: string;
    description: string;
  };
  services: HomeServiceItem[];
  profileSection: HomeProfileSection;
  featuredNewsTitle: string;
  highlightedNews: HomeNewsItem[];
  contactForm: HomeContactFormContent;
};
