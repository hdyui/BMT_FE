import type {
  CareerJob,
  CareersPageContent,
  CareersPublicData,
} from "@/features/careers/types/careers-public";

type UnknownRecord = Record<string, unknown>;

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

function stringArray(record: UnknownRecord | null, key: string) {
  return asArray(record?.[key]).filter(
    (item): item is string => typeof item === "string",
  );
}

export function emptyCareersPublicData(): CareersPublicData {
  return {
    jobs: [],
    page: {
      hero: {
        title: "",
        description: "",
        ctaLabel: "",
        ctaHref: "",
        desktopImage: "",
        desktopAlt: "",
      },
      jobsSection: { title: "" },
      contactForm: {
        title: "",
        description: "",
        nameLabel: "",
        namePlaceholder: "",
        phoneLabel: "",
        phonePlaceholder: "",
        submitLabel: "",
        requiredMessage: "",
        successMessage: "",
      },
    },
  };
}

function mapJob(value: unknown): CareerJob | null {
  const record = asRecord(value);
  if (!record) return null;

  const id = stringValue(record, "id");
  const title = stringValue(record, "title");
  const image = stringValue(record, "image");
  if (!id || !title || !image) return null;

  return {
    id,
    title,
    department: stringValue(record, "department"),
    location: stringValue(record, "location"),
    schedule: stringValue(record, "schedule"),
    compensation: stringValue(record, "compensation"),
    summary: stringValue(record, "summary"),
    image,
    responsibilities: stringArray(record, "responsibilities"),
    benefits: stringArray(record, "benefits"),
  };
}

function mapPage(value: unknown): CareersPageContent {
  const page = asRecord(value);
  const hero = asRecord(page?.hero);
  const jobsSection = asRecord(page?.jobsSection);
  const contactForm = asRecord(page?.contactForm);

  return {
    hero: {
      title: stringValue(hero, "title"),
      description: stringValue(hero, "description"),
      ctaLabel: stringValue(hero, "ctaLabel"),
      ctaHref: stringValue(hero, "ctaHref"),
      desktopImage: stringValue(hero, "desktopImage"),
      desktopAlt: stringValue(hero, "desktopAlt"),
    },
    jobsSection: {
      title: stringValue(jobsSection, "title"),
    },
    contactForm: {
      title: stringValue(contactForm, "title"),
      description: stringValue(contactForm, "description"),
      nameLabel: stringValue(contactForm, "nameLabel"),
      namePlaceholder: stringValue(contactForm, "namePlaceholder"),
      phoneLabel: stringValue(contactForm, "phoneLabel"),
      phonePlaceholder: stringValue(contactForm, "phonePlaceholder"),
      submitLabel: stringValue(contactForm, "submitLabel"),
      requiredMessage: stringValue(contactForm, "requiredMessage"),
      successMessage: stringValue(contactForm, "successMessage"),
    },
  };
}

export function buildCareersPublicData({
  jobsApiValue,
  pageApiValue,
}: {
  jobsApiValue?: unknown;
  pageApiValue?: unknown;
}): CareersPublicData {
  return {
    jobs: asArray(jobsApiValue)
      .map(mapJob)
      .filter((item): item is CareerJob => Boolean(item)),
    page: mapPage(pageApiValue),
  };
}
