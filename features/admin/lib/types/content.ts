export type ContentStatus = "draft" | "published";
export type Priority = "P1" | "P2";
export type ViewState = "normal" | "loading" | "empty" | "error";

export interface HomeHeroSlideContent {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  desktopImage: string;
  desktopAlt: string;
  mobileImage: string;
  mobileAlt: string;
  order: number;
  enabled: boolean;
}

export interface AdminProjectCard {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  imageAlt: string;
  category: string;
  href: string;
  status: ContentStatus;
  order: number;
  createdAt: string;
}

export interface AdminProjectCategory {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
  mobileIcon: string;
  mobileActiveIcon: string;
  order: number;
}

export interface AdminProjectDetailContent {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  client: string;
  area: string;
  scale: string;
  styleText: string;
  scope: string;
  year: number;
  overview: string;
  surveyText: string;
  drawingCaption: string;
  solution: string;
  processDescription: string;
  heroImage: string;
  heroAlt: string;
}

export interface AdminRelatedProject {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  href: string;
  order: number;
}

export interface ProjectContentBundle {
  cards: AdminProjectCard[];
  categories: AdminProjectCategory[];
  details: AdminProjectDetailContent[];
  related: AdminRelatedProject[];
}

export interface AdminModuleScopeItem {
  title: string;
  description: string;
  priority: Priority;
  count?: string;
  href?: string;
}
