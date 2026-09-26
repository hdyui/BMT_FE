import type {
  ProjectDetail,
  ProjectImage,
  ProjectsPageContent,
  ProjectsPublicData,
  PublicProjectCategory,
  PublicProjectListItem,
} from "@/features/projects/types/projects-public";

type UnknownRecord = Record<string, unknown>;

const renderSizes = [
  [2577, 3559],
  [2260, 1695],
  [2260, 1695],
  [1541, 1186],
  [1539, 1172],
  [1539, 1186],
] as const;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function stringValue(record: UnknownRecord | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : "";
}

function boolValue(record: UnknownRecord | null, key: string) {
  return record?.[key] === true;
}

function nullableNumberValue(record: UnknownRecord | null, key: string) {
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function image(
  src: string,
  alt: string,
  width = 1600,
  height = 1200,
): ProjectImage {
  return { src, alt, width, height };
}

export function emptyProjectsPublicData(): ProjectsPublicData {
  return {
    projects: [],
    categories: [],
    page: {
      hero: {
        title: "",
        description: "",
        desktopImage: "",
        imageAlt: "",
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

function mapListItem(value: unknown): PublicProjectListItem | null {
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
    style: stringValue(record, "style"),
    area: stringValue(record, "area"),
    year: nullableNumberValue(record, "year"),
    categoryId: stringValue(record, "categoryId"),
    categoryName: stringValue(record, "categoryName"),
    imageUrl,
    isFeatured: boolValue(record, "isFeatured"),
    createdAt: stringValue(record, "createdAt") || undefined,
    href: `/projects/${slug}`,
  };
}

function mapCategory(value: unknown): PublicProjectCategory | null {
  const record = asRecord(value);
  if (!record) return null;
  const id = stringValue(record, "id");
  const name = stringValue(record, "name");
  return id && name ? { id, name } : null;
}

function mapPage(value: unknown): ProjectsPageContent {
  const page = asRecord(value);
  const hero = asRecord(page?.hero);
  const contactForm = asRecord(page?.contactForm);

  return {
    hero: {
      title: stringValue(hero, "title"),
      description: stringValue(hero, "description"),
      desktopImage: stringValue(hero, "desktopImage"),
      imageAlt: stringValue(hero, "imageAlt"),
    },
    contactForm: {
      title: stringValue(contactForm, "title"),
      description: stringValue(contactForm, "description"),
      submitLabel: stringValue(contactForm, "submitLabel"),
      successMessage: stringValue(contactForm, "successMessage"),
    },
  };
}

export function buildProjectsPublicData({
  projectsApiValue,
  categoriesApiValue,
  pageApiValue,
}: {
  projectsApiValue?: unknown;
  categoriesApiValue?: unknown;
  pageApiValue?: unknown;
}): ProjectsPublicData {
  const projects = asArray(projectsApiValue)
    .map(mapListItem)
    .filter((item): item is PublicProjectListItem => Boolean(item));

  return {
    projects,
    categories: asArray(categoriesApiValue)
      .map(mapCategory)
      .filter((item): item is PublicProjectCategory => Boolean(item)),
    page: mapPage(pageApiValue),
  };
}

export function mapProjectDetail(value: unknown): ProjectDetail | null {
  const root = asRecord(value);
  const card = asRecord(root?.card);
  const detail = asRecord(root?.detail);
  const overview = asRecord(detail?.overview);
  const survey = asRecord(detail?.survey);
  const solution = asRecord(detail?.solution);
  const renders = asRecord(detail?.renders);
  const process = asRecord(detail?.process);
  const comparisons = asRecord(detail?.comparisons);
  const contactForm = asRecord(detail?.contactForm);

  const id = stringValue(root, "id");
  const slug = stringValue(root, "slug");
  const title = stringValue(overview, "title") || stringValue(card, "title");
  const heroImage = stringValue(overview, "heroImage") || stringValue(card, "imageUrl");

  if (!id || !slug || !title || !heroImage || !detail) return null;

  const surveyImages = [1, 2, 3]
    .map((index) => stringValue(survey, `survey${index}Image`))
    .filter(Boolean)
    .map((src, index) => image(src, `${title} - ảnh khảo sát ${index + 1}`, 1619, 1459));

  const renderImages = [1, 2, 3, 4, 5, 6]
    .map((index) => stringValue(renders, `render${index}Image`))
    .filter(Boolean)
    .map((src, index) =>
      image(
        src,
        `${title} - phối cảnh ${index + 1}`,
        renderSizes[index]?.[0] ?? 1600,
        renderSizes[index]?.[1] ?? 1200,
      ),
    );

  const processImages = [1, 2, 3, 4]
    .map((index) => {
      const src = stringValue(process, `process${index}Image`);
      const label = stringValue(process, `process${index}Label`);
      return src
        ? { ...image(src, label || `${title} - giai đoạn ${index}`, 1200, 1584), label }
        : null;
    })
    .filter((item): item is ProjectImage & { label: string } => Boolean(item));

  const comparisonItems = [1, 2, 3]
    .map((index) => {
      const beforeSrc = stringValue(comparisons, `comparison${index}BeforeImage`);
      const afterSrc = stringValue(comparisons, `comparison${index}AfterImage`);
      if (!beforeSrc || !afterSrc) return null;
      const beforeLabel =
        stringValue(comparisons, `comparison${index}BeforeLabel`) || "Trước";
      const afterLabel =
        stringValue(comparisons, `comparison${index}AfterLabel`) || "Sau";
      return {
        before: { ...image(beforeSrc, `${title} - ${beforeLabel}`), label: beforeLabel },
        after: { ...image(afterSrc, `${title} - ${afterLabel}`), label: afterLabel },
      };
    })
    .filter(
      (
        item,
      ): item is {
        before: ProjectImage & { label: string };
        after: ProjectImage & { label: string };
      } => Boolean(item),
    );

  const wordmarkSrc = stringValue(overview, "wordmarkImage");

  return {
    id,
    slug,
    title,
    projectName: stringValue(overview, "projectName") || stringValue(card, "title"),
    category: stringValue(overview, "category") || stringValue(card, "categoryName"),
    location: stringValue(overview, "location"),
    client: stringValue(overview, "client"),
    area: stringValue(overview, "area"),
    year: nullableNumberValue(overview, "year"),
    scale: stringValue(overview, "scale"),
    style: stringValue(overview, "style"),
    scope: "",
    description: stringValue(overview, "description")
      ? [stringValue(overview, "description")]
      : [],
    surveyDescription: stringValue(survey, "surveyDescription"),
    drawingCaption: stringValue(solution, "drawingCaption"),
    solutionDescription: stringValue(solution, "solutionDescription"),
    galleryDescription: stringValue(renders, "galleryDescription"),
    processDescription: stringValue(process, "processDescription"),
    ctaTitle: stringValue(contactForm, "ctaTitle"),
    ctaDescription: stringValue(contactForm, "ctaDescription"),
    ctaSuccessMessage: stringValue(contactForm, "ctaSuccessMessage"),
    ctaSubmitLabel: "",
    heroImage: image(heroImage, title, 2560, 2500),
    wordmarkImage: wordmarkSrc
      ? image(wordmarkSrc, stringValue(overview, "projectName") || title, 2075, 491)
      : null,
    survey: surveyImages,
    drawing: image(
      stringValue(solution, "drawingImage") || heroImage,
      stringValue(solution, "drawingCaption") || title,
      3636,
      2426,
    ),
    renders: renderImages,
    process: processImages,
    comparisons: comparisonItems,
  };
}
