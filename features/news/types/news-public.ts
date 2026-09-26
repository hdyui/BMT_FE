export type PublicNewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  featured: boolean;
  highlightHome: boolean;
  createdAt?: string;
  href: string;
  imageAlt: string;
};

export type NewsPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    desktopImage: string;
    imageAlt: string;
  };
  featuredSection: {
    title: string;
  };
  contactForm: {
    title: string;
    description: string;
    submitLabel: string;
    successMessage: string;
  };
};

export type NewsPublicData = {
  articles: PublicNewsArticle[];
  featuredArticles: PublicNewsArticle[];
  page: NewsPageContent;
};
