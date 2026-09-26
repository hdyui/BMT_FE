export type PublicProjectListItem = {
  id: string;
  slug: string;
  title: string;
  style: string;
  area: string;
  year: number | null;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  isFeatured: boolean;
  createdAt?: string;
  href: string;
};

export type PublicProjectCategory = {
  id: string;
  name: string;
};

export type ProjectsPageContent = {
  hero: {
    title: string;
    description: string;
    desktopImage: string;
    imageAlt: string;
  };
  contactForm: {
    title: string;
    description: string;
    submitLabel: string;
    successMessage: string;
  };
};

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectDetail = {
  id: string;
  slug: string;
  title: string;
  projectName: string;
  category: string;
  location: string;
  client: string;
  area: string;
  year: number | null;
  scale: string;
  style: string;
  scope: string;
  description: string[];
  surveyDescription: string;
  drawingCaption: string;
  solutionDescription: string;
  galleryDescription: string;
  processDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaSuccessMessage: string;
  ctaSubmitLabel: string;
  heroImage: ProjectImage;
  wordmarkImage: ProjectImage | null;
  survey: ProjectImage[];
  drawing: ProjectImage;
  renders: ProjectImage[];
  process: Array<ProjectImage & { label: string }>;
  comparisons: Array<{
    before: ProjectImage & { label: string };
    after: ProjectImage & { label: string };
  }>;
};

export type ProjectsPublicData = {
  projects: PublicProjectListItem[];
  categories: PublicProjectCategory[];
  page: ProjectsPageContent;
};
