import type {
  NewsPageContent,
  NewsPublicData,
  PublicNewsArticle,
} from "@/features/news/types/news-public";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function stringValue(record: UnknownRecord | null, key: string): string {
  const value = record?.[key];
  return typeof value === "string" ? value : "";
}

function booleanValue(record: UnknownRecord | null, key: string): boolean {
  return record?.[key] === true;
}

export function emptyNewsPublicData(): NewsPublicData {
  return {
    articles: [],
    featuredArticles: [],
    page: {
      hero: {
        eyebrow: "",
        title: "",
        description: "",
        ctaLabel: "",
        ctaHref: "",
        desktopImage: "",
        imageAlt: "",
      },
      featuredSection: {
        title: "",
      },
      contactForm: {
        title: "",
        description: "",
        submitLabel: "",
        successMessage: "",
      },
    },
  };
}

function mapArticle(value: unknown): PublicNewsArticle | null {
  const record = asRecord(value);
  if (!record) return null;

  const id = stringValue(record, "id");
  const slug = stringValue(record, "slug");
  const title = stringValue(record, "title");
  const imageUrl = stringValue(record, "imageUrl");

  if (!id || !slug || !title || !imageUrl) return null;

  return {
    id,
    slug,
    title,
    excerpt: stringValue(record, "excerpt"),
    imageUrl,
    featured: booleanValue(record, "featured"),
    highlightHome: booleanValue(record, "highlightHome"),
    createdAt: stringValue(record, "createdAt") || undefined,
    href: `/news#${slug}`,
    imageAlt: title,
  };
}

function mapPageContent(value: unknown): NewsPageContent {
  const page = asRecord(value);
  const hero = asRecord(page?.hero);
  const featuredSection = asRecord(page?.featuredSection);
  const contactForm = asRecord(page?.contactForm);

  return {
    hero: {
      eyebrow: stringValue(hero, "eyebrow"),
      title: stringValue(hero, "title"),
      description: stringValue(hero, "description"),
      ctaLabel: stringValue(hero, "ctaLabel"),
      ctaHref: stringValue(hero, "ctaHref"),
      desktopImage: stringValue(hero, "desktopImage"),
      imageAlt: stringValue(hero, "imageAlt"),
    },
    featuredSection: {
      title: stringValue(featuredSection, "title"),
    },
    contactForm: {
      title: stringValue(contactForm, "title"),
      description: stringValue(contactForm, "description"),
      submitLabel: stringValue(contactForm, "submitLabel"),
      successMessage: stringValue(contactForm, "successMessage"),
    },
  };
}

export function buildNewsPublicData({
  newsApiValue,
  featuredApiValue,
  pageApiValue,
}: {
  newsApiValue?: unknown;
  featuredApiValue?: unknown;
  pageApiValue?: unknown;
}): NewsPublicData {
  const articles = asArray(newsApiValue)
    .map(mapArticle)
    .filter((item): item is PublicNewsArticle => Boolean(item));

  const featuredArticles = asArray(featuredApiValue)
    .map(mapArticle)
    .filter((item): item is PublicNewsArticle => Boolean(item))
    .filter((item) => item.featured)
    .slice(0, 5);

  return {
    articles,
    featuredArticles,
    page: mapPageContent(pageApiValue),
  };
}
