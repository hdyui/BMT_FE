import "server-only";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { publicApiTag } from "@/shared/lib/api/cache-tags";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_MOCK_SESSION,
  MOCK_ADMIN_ACCOUNT,
} from "@/features/admin/lib/auth-config";
import type { AdminCrudRecord } from "@/features/admin/lib/types/crud";
import {
  CONTACT_PAGE_ADMIN_API_RESOURCE_KEYS,
  ABOUT_ADMIN_API_RESOURCE_KEYS,
  HOME_ADMIN_API_RESOURCE_KEYS,
  NEWS_PAGE_ADMIN_API_RESOURCE_KEYS,
  PROJECTS_PAGE_ADMIN_API_RESOURCE_KEYS,
  RECRUITMENT_PAGE_ADMIN_API_RESOURCE_KEYS,
  SETTINGS_ADMIN_API_RESOURCE_KEYS,
  isContactPageAdminApiResourceKey,
  isAboutAdminApiResourceKey,
  isHomeAdminApiResourceKey,
  isNewsPageAdminApiResourceKey,
  isProjectsPageAdminApiResourceKey,
  isRecruitmentPageAdminApiResourceKey,
  isSettingsAdminApiResourceKey,
  type AdminApiResourceKey,
  type FormSubmissionItem,
  type FormSubmissionStatus,
  type FormSubmissionsPage,
} from "@/features/admin/services/catalog-api.types";
import { getApiBaseUrl } from "@/shared/lib/api/server";

export const ADMIN_API_RESOURCE_KEYS = [
  "projects/list",
  "projects/details",
  "news/list",
  "recruitment/jobs",
  ...HOME_ADMIN_API_RESOURCE_KEYS,
  ...CONTACT_PAGE_ADMIN_API_RESOURCE_KEYS,
  ...ABOUT_ADMIN_API_RESOURCE_KEYS,
  ...SETTINGS_ADMIN_API_RESOURCE_KEYS,
  ...PROJECTS_PAGE_ADMIN_API_RESOURCE_KEYS,
  ...NEWS_PAGE_ADMIN_API_RESOURCE_KEYS,
  ...RECRUITMENT_PAGE_ADMIN_API_RESOURCE_KEYS,
] as const;

const SETTINGS_PARTNER_COUNT = 6;

type UnknownRecord = Record<string, unknown>;

let cachedBackendSessionCookie: string | null = null;
let cachedBackendSessionAt = 0;
const backendSessionReuseMs = 15 * 60 * 1000;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function unwrap(value: unknown): unknown {
  const record = asRecord(value);
  return record && "value" in record ? record.value : value;
}

function stringValue(record: UnknownRecord | null, ...keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "string") return value;
  }
  return "";
}

function booleanValue(record: UnknownRecord | null, ...keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "boolean") return value;
  }
  return false;
}

function numberValue(record: UnknownRecord | null, key: string) {
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : "";
}

function htmlList(value: unknown) {
  if (typeof value === "string") return value;
  const values = asArray(value).filter(
    (item): item is string => typeof item === "string" && Boolean(item.trim()),
  );
  return values.length
    ? `<ul>${values.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : "";
}

async function readBody(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function performBackendLogin(baseUrl: string, force = false) {
  if (
    !force &&
    cachedBackendSessionCookie &&
    Date.now() - cachedBackendSessionAt < backendSessionReuseMs
  ) {
    return cachedBackendSessionCookie;
  }

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: MOCK_ADMIN_ACCOUNT.email,
        password: MOCK_ADMIN_ACCOUNT.password,
      }),
    });

    if (response.status === 429 && attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 2500));
      continue;
    }

    if (!response.ok) {
      throw new Error(`Backend admin login failed (HTTP ${response.status}).`);
    }

    const setCookies =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : [response.headers.get("set-cookie")].filter(
            (item): item is string => Boolean(item),
          );

    const cookie = setCookies
      .map((item) => item.split(";")[0])
      .filter(Boolean)
      .join("; ");

    if (!cookie) {
      throw new Error("Backend admin login returned no session cookie.");
    }

    cachedBackendSessionCookie = cookie;
    cachedBackendSessionAt = Date.now();
    return cookie;
  }

  throw new Error("Backend admin login retry exhausted.");
}

let loginInFlight: Promise<string> | null = null;
async function backendLogin(baseUrl: string, force = false) {
  if (loginInFlight) return loginInFlight;
  loginInFlight = performBackendLogin(baseUrl, force).finally(() => { loginInFlight = null; });
  return loginInFlight;
}

type BackendResult = { response: Response; body: unknown; cookie: string };
const inFlightReads = new Map<string, Promise<BackendResult>>();

async function backendRequest(path: string, init: RequestInit = {}, sessionCookie?: string): Promise<BackendResult> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("API_CLIENT is not configured.");
  const cookie = sessionCookie ?? await backendLogin(baseUrl);
  const method = (init.method ?? "GET").toUpperCase();
  const key = baseUrl + path + "|" + cookie;
  if (method === "GET" && inFlightReads.has(key)) return inFlightReads.get(key)!;
  const request = (async () => {
    let activeCookie = cookie;
    const send = () => {
      const headers = new Headers(init.headers);
      headers.set("Accept", "application/json");
      headers.set("Cookie", activeCookie);
      return fetch(baseUrl + path, { ...init, cache: "no-store", headers, signal: init.signal ?? AbortSignal.timeout(30_000) });
    };
    let response = await send();
    if (response.status === 401) {
      activeCookie = cachedBackendSessionCookie && cachedBackendSessionCookie !== cookie
        ? cachedBackendSessionCookie : await backendLogin(baseUrl, true);
      response = await send();
    }
    const body = await readBody(response);
    const envelope = asRecord(body);
    if (response.ok && (envelope?.isSuccess === false || envelope?.isFailed === true)) {
      throw new Error("Backend rejected the request.");
    }
    if (method !== "GET" && response.ok && path.startsWith("/admin/") && path !== "/admin/upload") {
      // Expire immediately so the next public render sees the saved data.
      revalidateTag(publicApiTag(path.replace(/^\/admin/, "")), { expire: 0 });
      inFlightReads.clear();
    }
    return { response, body, cookie: activeCookie };
  })();
  if (method === "GET") {
    inFlightReads.set(key, request);
    void request.finally(() => { if (inFlightReads.get(key) === request) inFlightReads.delete(key); }).catch(() => {});
  }
  return request;
}

async function requireLocalAdminSession() {
  const store = await cookies();
  return store.get(ADMIN_AUTH_COOKIE)?.value === ADMIN_MOCK_SESSION;
}

function normalizeProjects(value: unknown): AdminCrudRecord[] {
  const root = asRecord(unwrap(value));
  const items = root?.items ? asArray(root.items) : asArray(unwrap(value));

  return items.flatMap((raw, index) => {
    const item = asRecord(raw);
    const card = asRecord(item?.card) ?? item;
    const id = stringValue(item, "id");
    if (!item || !card || !id) return [];

    const slug = stringValue(item, "slug");
    const title = stringValue(card, "title", "cardTitle");
    const category = stringValue(card, "categoryName", "category");
    const thumbnail = stringValue(card, "imageUrl", "thumbnail", "cardImageUrl");
    const highlight = booleanValue(card, "isFeatured", "highlight");

    return [{
      id,
      slug,
      title,
      category,
      categoryId: stringValue(card, "categoryId"),
      href: slug ? `/projects/${slug}` : "",
      thumbnail,
      imageAlt: title,
      highlight,
      order: index + 1,
    }];
  });
}

function normalizeProjectDetails(value: unknown): AdminCrudRecord[] {
  const items = asArray(value);

  return items.flatMap((raw) => {
    const item = asRecord(raw);
    const id = stringValue(item, "id");
    const slug = stringValue(item, "slug");
    const detail = asRecord(item?.detail);
    if (!item || !id || !detail) return [];

    const overview = asRecord(detail.overview);
    const survey = asRecord(detail.survey);
    const solution = asRecord(detail.solution);
    const renders = asRecord(detail.renders);
    const process = asRecord(detail.process);
    const comparisons = asRecord(detail.comparisons);
    const contactForm = asRecord(detail.contactForm);

    const record: AdminCrudRecord = {
      id,
      slug,
      title: stringValue(overview, "title"),
      projectName: stringValue(overview, "projectName"),
      category: stringValue(overview, "category"),
      location: stringValue(overview, "location"),
      client: stringValue(overview, "client"),
      area: stringValue(overview, "area"),
      style: stringValue(overview, "style"),
      year: numberValue(overview, "year"),
      scale: stringValue(overview, "scale"),
      heroImage: stringValue(overview, "heroImage"),
      wordmarkImage: stringValue(overview, "wordmarkImage"),
      description: stringValue(overview, "description"),
      surveyDescription: stringValue(survey, "surveyDescription"),
      drawingCaption: stringValue(solution, "drawingCaption"),
      solutionDescription: stringValue(solution, "solutionDescription"),
      drawingImage: stringValue(solution, "drawingImage"),
      galleryDescription: stringValue(renders, "galleryDescription"),
      processDescription: stringValue(process, "processDescription"),
      ctaTitle: stringValue(contactForm, "ctaTitle"),
      ctaDescription: stringValue(contactForm, "ctaDescription"),
      ctaSuccessMessage: stringValue(contactForm, "ctaSuccessMessage"),
    };

    for (let index = 1; index <= 3; index += 1) {
      record[`survey${index}Image`] = stringValue(
        survey,
        `survey${index}Image`,
      );
    }

    for (let index = 1; index <= 6; index += 1) {
      record[`render${index}Image`] = stringValue(
        renders,
        `render${index}Image`,
      );
    }

    for (let index = 1; index <= 4; index += 1) {
      record[`process${index}Label`] = stringValue(
        process,
        `process${index}Label`,
      );
      record[`process${index}Image`] = stringValue(
        process,
        `process${index}Image`,
      );
    }

    for (let index = 1; index <= 3; index += 1) {
      record[`comparison${index}BeforeLabel`] = stringValue(
        comparisons,
        `comparison${index}BeforeLabel`,
      );
      record[`comparison${index}BeforeImage`] = stringValue(
        comparisons,
        `comparison${index}BeforeImage`,
      );
      record[`comparison${index}AfterLabel`] = stringValue(
        comparisons,
        `comparison${index}AfterLabel`,
      );
      record[`comparison${index}AfterImage`] = stringValue(
        comparisons,
        `comparison${index}AfterImage`,
      );
    }

    return [record];
  });
}

function normalizeNews(value: unknown): AdminCrudRecord[] {
  const root = asRecord(unwrap(value));
  const items = root?.items ? asArray(root.items) : asArray(unwrap(value));

  return items.flatMap((raw, index) => {
    const item = asRecord(raw);
    const id = stringValue(item, "id");
    if (!item || !id) return [];
    const slug = stringValue(item, "slug");
    const title = stringValue(item, "title");
    const image = stringValue(item, "desktopImage", "imageUrl");

    return [{
      id,
      slug,
      title,
      excerpt: stringValue(item, "excerpt"),
      desktopImage: image,
      imageAlt: title,
      href: slug ? `/news#${slug}` : "",
      body: stringValue(item, "body") || stringValue(asRecord(item.content), "body"),
      featured: booleanValue(item, "featured"),
      highlightHome: booleanValue(item, "highlightHome"),
      order: index + 1,
    }];
  });
}

function normalizeJobs(value: unknown): AdminCrudRecord[] {
  const root = asRecord(unwrap(value));
  const items = root?.items ? asArray(root.items) : asArray(unwrap(value));

  return items.flatMap((raw) => {
    const item = asRecord(raw);
    const id = stringValue(item, "id");
    const title = stringValue(item, "title");
    if (!item || !id) return [];

    return [{
      id,
      title,
      department: stringValue(item, "department"),
      location: stringValue(item, "location"),
      schedule: stringValue(item, "schedule"),
      compensation: stringValue(item, "compensation"),
      summary: stringValue(item, "summary"),
      image: stringValue(item, "image"),
      imageAlt: title,
      responsibilities: htmlList(item.responsibilities),
      benefits: htmlList(item.benefits),
    }];
  });
}

function flattenHomeNodes(value: unknown): UnknownRecord[] {
  const page = asRecord(unwrap(value));
  const roots = asArray(page?.nodes);
  const flattened: UnknownRecord[] = [];

  const visit = (candidate: unknown) => {
    const node = asRecord(candidate);
    if (!node) return;
    flattened.push(node);
    for (const child of asArray(node.children)) visit(child);
  };

  for (const root of roots) visit(root);
  return flattened;
}

function homeNodeValue(node: UnknownRecord | null) {
  return asRecord(node?.value);
}

function homeNodeByKey(nodes: UnknownRecord[], nodeKey: string) {
  return (
    nodes.find((node) => stringValue(node, "nodeKey") === nodeKey) ?? null
  );
}

function homeChildRecords(
  nodes: UnknownRecord[],
  sectionKey: string,
  map: (
    node: UnknownRecord,
    value: UnknownRecord | null,
    index: number,
  ) => AdminCrudRecord,
) {
  const section = homeNodeByKey(nodes, sectionKey);
  const children = asArray(section?.children)
    .map(asRecord)
    .filter((item): item is UnknownRecord => Boolean(item))
    .sort((left, right) =>
      stringValue(left, "nodeKey").localeCompare(stringValue(right, "nodeKey")),
    );

  return children.flatMap((node, index) => {
    const id = stringValue(node, "id");
    if (!id) return [];
    return [map(node, homeNodeValue(node), index)];
  });
}

function homeSingletonRecord(
  nodes: UnknownRecord[],
  nodeKey: string,
  fields: string[],
) {
  const node = homeNodeByKey(nodes, nodeKey);
  const id = stringValue(node, "id");
  if (!node || !id) return [];
  const value = homeNodeValue(node);
  const record: AdminCrudRecord = { id };
  for (const field of fields) {
    record[field] = stringValue(value, field);
  }
  return [record];
}

function normalizeHomeRecords(
  resourceKey: AdminApiResourceKey,
  value: unknown,
): AdminCrudRecord[] {
  const nodes = flattenHomeNodes(value);

  if (resourceKey === "home/hero") {
    return homeChildRecords(nodes, "hero", (node, item, index) => ({
      id: stringValue(node, "id"),
      title: stringValue(item, "title"),
      description: stringValue(item, "description"),
      desktopImage: stringValue(item, "desktopImage"),
      mobileImage: stringValue(item, "mobileImage"),
      displayName: stringValue(item, "displayName"),
      order: index + 1,
    }));
  }

  if (resourceKey === "home/why-bmt") {
    return homeChildRecords(nodes, "whyBmt", (node, item, index) => ({
      id: stringValue(node, "id"),
      title: stringValue(item, "title"),
      description: stringValue(item, "description"),
      defaultImage: stringValue(item, "defaultImage"),
      mobileImage: stringValue(item, "mobileImage"),
      order: index + 1,
    }));
  }

  if (resourceKey === "home/statistics") {
    return homeChildRecords(nodes, "statistics", (node, item, index) => ({
      id: stringValue(node, "id"),
      value: numberValue(item, "value"),
      label: stringValue(item, "label"),
      suffix: stringValue(item, "suffix"),
      order: index + 1,
    }));
  }

  if (resourceKey === "home/featured-services") {
    return homeChildRecords(
      nodes,
      "featuredServices",
      (node, item, index) => ({
        id: stringValue(node, "id"),
        title: stringValue(item, "title"),
        description: stringValue(item, "description"),
        desktopImage: stringValue(item, "desktopImage"),
        mobileImage: stringValue(item, "mobileImage"),
        order: index + 1,
      }),
    );
  }

  if (resourceKey === "home/trust-section-content") {
    return homeSingletonRecord(nodes, "trustSectionContent", [
      "titleDesktop",
      "titleMobile",
      "descriptionDesktop",
      "descriptionMobile",
    ]);
  }

  if (resourceKey === "home/services-section-content") {
    return homeSingletonRecord(nodes, "servicesSectionContent", [
      "title",
      "description",
    ]);
  }

  if (resourceKey === "home/profile-section-content") {
    return homeSingletonRecord(nodes, "profileSection", [
      "title",
      "subtitle",
      "description",
      "oneBookImage",
      "threeBooksImage",
    ]);
  }

  if (resourceKey === "home/contact-form") {
    return homeSingletonRecord(nodes, "contactForm", [
      "title",
      "subtitle",
      "successMessage",
    ]);
  }

  return [];
}

function getAboutContent(value: unknown) {
  const page = asRecord(unwrap(value));
  return asRecord(page?.content) ?? page;
}

function normalizeAboutRecords(
  resourceKey: AdminApiResourceKey,
  value: unknown,
): AdminCrudRecord[] {
  const content = getAboutContent(value);
  if (!content) return [];

  const hero = asRecord(content.hero);
  const journey = asRecord(content.journey);
  const visionMission = asRecord(content.visionMission);
  const coreValues = asRecord(content.coreValues);
  const capabilities = asRecord(content.capabilities);
  const contactForm = asRecord(content.contactForm);

  if (resourceKey === "about/hero") {
    return hero
      ? [{
          id: "about-hero",
          eyebrow: stringValue(hero, "eyebrow"),
          heading: stringValue(hero, "heading"),
          description: stringValue(hero, "description"),
          desktopImage: stringValue(hero, "desktopImage"),
        }]
      : [];
  }

  if (resourceKey === "about/journey") {
    return asArray(journey?.items).flatMap((raw, index) => {
      const item = asRecord(raw);
      if (!item) return [];
      return [{
        id: `about-journey-${index + 1}`,
        year: stringValue(item, "year"),
        title: stringValue(item, "title"),
        description: stringValue(item, "description"),
        order: index + 1,
      }];
    });
  }

  if (resourceKey === "about/journey-section-content") {
    return journey
      ? [{
          id: "about-journey-section-content",
          title: stringValue(journey, "title"),
        }]
      : [];
  }

  if (resourceKey === "about/vision-mission") {
    return visionMission
      ? [{
          id: "about-vision-mission",
          visionHeading: stringValue(visionMission, "visionHeading"),
          visionDescription: stringValue(visionMission, "visionDescription"),
          missionHeading: stringValue(visionMission, "missionHeading"),
          missionDescription: stringValue(visionMission, "missionDescription"),
        }]
      : [];
  }

  if (resourceKey === "about/core-values") {
    return asArray(coreValues?.items).flatMap((raw, index) => {
      const item = asRecord(raw);
      if (!item) return [];
      return [{
        id: `about-core-value-${index + 1}`,
        title: stringValue(item, "title"),
        description: stringValue(item, "description"),
        image: stringValue(item, "image"),
        order: index + 1,
      }];
    });
  }

  if (resourceKey === "about/core-values-section-content") {
    return coreValues
      ? [{
          id: "about-core-values-section-content",
          title: stringValue(coreValues, "title"),
        }]
      : [];
  }

  if (resourceKey === "about/capabilities") {
    return asArray(capabilities?.items).flatMap((raw, index) => {
      const item = asRecord(raw);
      if (!item) return [];
      return [{
        id: `about-capability-${index + 1}`,
        number: String(index + 1).padStart(2, "0"),
        title: stringValue(item, "title"),
        mobileTitle: stringValue(item, "mobileTitle"),
        description: stringValue(item, "description"),
        order: index + 1,
      }];
    });
  }

  if (resourceKey === "about/capabilities-section-content") {
    return capabilities
      ? [{
          id: "about-capabilities-section-content",
          title: stringValue(capabilities, "title"),
        }]
      : [];
  }

  if (resourceKey === "about/contact-form") {
    return contactForm
      ? [{
          id: "about-contact-form",
          title: stringValue(contactForm, "title"),
          description: stringValue(contactForm, "description"),
          successMessage: stringValue(contactForm, "successMessage"),
        }]
      : [];
  }

  return [];
}

function getSiteSettings(value: unknown) {
  return asRecord(unwrap(value));
}

function normalizeSettingsRecords(
  resourceKey: AdminApiResourceKey,
  value: unknown,
): AdminCrudRecord[] {
  const settings = getSiteSettings(value);
  const header = asRecord(settings?.header);
  const partners = asRecord(settings?.partners);
  const footer = asRecord(settings?.footer);

  if (resourceKey === "settings/branding") {
    return [{
      id: "branding",
      logo: stringValue(header, "logo"),
      logoAlt: stringValue(header, "logoAlt"),
    }];
  }

  if (resourceKey === "settings/partners") {
    const items = asArray(partners?.items).map(asRecord);
    return Array.from({ length: SETTINGS_PARTNER_COUNT }, (_, index) => {
      const existing =
        items.find((item) => numberValue(item, "order") === index + 1) ??
        items[index] ??
        null;
      return {
        id: stringValue(existing, "id") || `partner-${index + 1}`,
        name: stringValue(existing, "name"),
        logoImage: stringValue(existing, "logoImage"),
        logoAlt: stringValue(existing, "logoAlt"),
        order: index + 1,
      };
    });
  }

  if (resourceKey === "settings/partners-section-content") {
    return [{
      id: "settings-partners-section-content",
      title: stringValue(partners, "title"),
    }];
  }

  if (resourceKey === "settings/footer") {
    const fields = [
      "footerLogo",
      "footerLogoAlt",
      "service1Label",
      "service1Href",
      "service2Label",
      "service2Href",
      "service3Label",
      "service3Href",
      "service4Label",
      "service4Href",
      "contactHeading",
      "officeAddress",
      "phone",
      "email",
      "branchesHeading",
      "branch1Address",
      "branch2Address",
      "workshopAddress",
      "facebookUrl",
      "tiktokUrl",
      "instagramUrl",
      "linkedinUrl",
      "socialWidgetImage",
      "socialWidgetAlt",
    ];
    const record: AdminCrudRecord = { id: "footer" };
    for (const field of fields) {
      record[field] = stringValue(footer, field);
    }
    return [record];
  }

  return [];
}

function getPageContent(value: unknown) {
  const page = asRecord(unwrap(value));
  return asRecord(page?.content) ?? page;
}

function normalizeProjectsPageRecords(
  resourceKey: AdminApiResourceKey,
  value: unknown,
): AdminCrudRecord[] {
  const content = getPageContent(value);
  if (!content) return [];
  const hero = asRecord(content.hero);
  const contactForm = asRecord(content.contactForm);

  if (resourceKey === "projects/page-hero") {
    return hero
      ? [{
          id: "projects-page-hero",
          title: stringValue(hero, "title"),
          description: stringValue(hero, "description"),
          desktopImage: stringValue(hero, "desktopImage"),
          imageAlt: stringValue(hero, "imageAlt"),
        }]
      : [];
  }

  if (resourceKey === "projects/contact-form") {
    return contactForm
      ? [{
          id: "projects-contact-form",
          title: stringValue(contactForm, "title"),
          description: stringValue(contactForm, "description"),
          submitLabel: stringValue(contactForm, "submitLabel"),
          successMessage: stringValue(contactForm, "successMessage"),
        }]
      : [];
  }

  return [];
}

function normalizeNewsPageRecords(
  resourceKey: AdminApiResourceKey,
  value: unknown,
): AdminCrudRecord[] {
  const content = getPageContent(value);
  if (!content) return [];
  const hero = asRecord(content.hero);
  const featuredSection = asRecord(content.featuredSection);
  const contactForm = asRecord(content.contactForm);

  if (resourceKey === "news/page-hero") {
    return hero
      ? [{
          id: "news-page-hero",
          eyebrow: stringValue(hero, "eyebrow"),
          title: stringValue(hero, "title"),
          description: stringValue(hero, "description"),
          ctaLabel: stringValue(hero, "ctaLabel"),
          ctaHref: stringValue(hero, "ctaHref"),
          desktopImage: stringValue(hero, "desktopImage"),
          imageAlt: stringValue(hero, "imageAlt"),
        }]
      : [];
  }

  if (resourceKey === "news/featured-section-content") {
    return featuredSection
      ? [{
          id: "news-featured-section-content",
          title: stringValue(featuredSection, "title"),
        }]
      : [];
  }

  if (resourceKey === "news/contact-form") {
    return contactForm
      ? [{
          id: "news-contact-form",
          title: stringValue(contactForm, "title"),
          description: stringValue(contactForm, "description"),
          submitLabel: stringValue(contactForm, "submitLabel"),
          successMessage: stringValue(contactForm, "successMessage"),
        }]
      : [];
  }

  return [];
}

function normalizeRecruitmentPageRecords(
  resourceKey: AdminApiResourceKey,
  value: unknown,
): AdminCrudRecord[] {
  const content = getPageContent(value);
  if (!content) return [];
  const hero = asRecord(content.hero);
  const jobsSection = asRecord(content.jobsSection);
  const contactForm = asRecord(content.contactForm);

  if (resourceKey === "recruitment/hero") {
    return hero
      ? [{
          id: "recruitment-hero",
          title: stringValue(hero, "title"),
          description: stringValue(hero, "description"),
          ctaLabel: stringValue(hero, "ctaLabel"),
          ctaHref: stringValue(hero, "ctaHref"),
          desktopImage: stringValue(hero, "desktopImage"),
          desktopAlt: stringValue(hero, "desktopAlt"),
        }]
      : [];
  }

  if (resourceKey === "recruitment/jobs-section-content") {
    return jobsSection
      ? [{
          id: "recruitment-jobs-section-content",
          title: stringValue(jobsSection, "title"),
        }]
      : [];
  }

  if (resourceKey === "recruitment/contact-form") {
    return contactForm
      ? [{
          id: "recruitment-contact-form",
          title: stringValue(contactForm, "title"),
          description: stringValue(contactForm, "description"),
          submitLabel: stringValue(contactForm, "submitLabel"),
          successMessage: stringValue(contactForm, "successMessage"),
        }]
      : [];
  }

  return [];
}

export function isAdminApiResourceKey(value: string): value is AdminApiResourceKey {
  return (ADMIN_API_RESOURCE_KEYS as readonly string[]).includes(value);
}

export function normalizeAdminApiRecords(
  resourceKey: AdminApiResourceKey,
  value: unknown,
) {
  if (resourceKey === "projects/list") return normalizeProjects(value);
  if (resourceKey === "projects/details") return normalizeProjectDetails(value);
  if (isHomeAdminApiResourceKey(resourceKey)) {
    return normalizeHomeRecords(resourceKey, value);
  }
  if (isContactPageAdminApiResourceKey(resourceKey)) return normalizeContactRecords(resourceKey, value);
  if (isAboutAdminApiResourceKey(resourceKey)) {
    return normalizeAboutRecords(resourceKey, value);
  }
  if (isSettingsAdminApiResourceKey(resourceKey)) {
    return normalizeSettingsRecords(resourceKey, value);
  }
  if (isProjectsPageAdminApiResourceKey(resourceKey)) {
    return normalizeProjectsPageRecords(resourceKey, value);
  }
  if (isNewsPageAdminApiResourceKey(resourceKey)) {
    return normalizeNewsPageRecords(resourceKey, value);
  }
  if (isRecruitmentPageAdminApiResourceKey(resourceKey)) {
    return normalizeRecruitmentPageRecords(resourceKey, value);
  }
  if (resourceKey === "news/list") return normalizeNews(value);
  return normalizeJobs(value);
}

async function fetchResourceRecords(
  resourceKey: AdminApiResourceKey,
  sessionCookie: string,
) {
  if (isHomeAdminApiResourceKey(resourceKey)) {
    const result = await backendRequest(
      "/admin/pages/home",
      {},
      sessionCookie,
    );
    if (!result.response.ok) {
      throw new Error(
        `GET /admin/pages/home failed (HTTP ${result.response.status}).`,
      );
    }
    return normalizeHomeRecords(resourceKey, result.body);
  }

  if (isContactPageAdminApiResourceKey(resourceKey)) {
    const result = await backendRequest("/admin/pages/contact", {}, sessionCookie);
    if (!result.response.ok) throw new Error("Cannot load Contact page.");
    return normalizeContactRecords(resourceKey, result.body);
  }
  if (isAboutAdminApiResourceKey(resourceKey)) {
    const result = await backendRequest(
      "/admin/pages/about",
      {},
      sessionCookie,
    );
    if (!result.response.ok) {
      throw new Error(
        `GET /admin/pages/about failed (HTTP ${result.response.status}).`,
      );
    }
    return normalizeAboutRecords(resourceKey, result.body);
  }

  if (isSettingsAdminApiResourceKey(resourceKey)) {
    const result = await backendRequest(
      "/admin/site-settings",
      {},
      sessionCookie,
    );
    if (!result.response.ok) {
      throw new Error(
        `GET /admin/site-settings failed (HTTP ${result.response.status}).`,
      );
    }
    return normalizeSettingsRecords(resourceKey, result.body);
  }

  if (isProjectsPageAdminApiResourceKey(resourceKey)) {
    const result = await backendRequest(
      "/admin/pages/projects",
      {},
      sessionCookie,
    );
    if (!result.response.ok) {
      throw new Error(
        `GET /admin/pages/projects failed (HTTP ${result.response.status}).`,
      );
    }
    return normalizeProjectsPageRecords(resourceKey, result.body);
  }

  if (isNewsPageAdminApiResourceKey(resourceKey)) {
    const result = await backendRequest(
      "/admin/pages/news",
      {},
      sessionCookie,
    );
    if (!result.response.ok) {
      throw new Error(
        `GET /admin/pages/news failed (HTTP ${result.response.status}).`,
      );
    }
    return normalizeNewsPageRecords(resourceKey, result.body);
  }

  if (isRecruitmentPageAdminApiResourceKey(resourceKey)) {
    const result = await backendRequest(
      "/admin/pages/recruitment",
      {},
      sessionCookie,
    );
    if (!result.response.ok) {
      throw new Error(
        `GET /admin/pages/recruitment failed (HTTP ${result.response.status}).`,
      );
    }
    return normalizeRecruitmentPageRecords(resourceKey, result.body);
  }

  const path =
    resourceKey === "projects/list"
      ? "/admin/projects?PageIndex=1&PageSize=500"
      : resourceKey === "projects/details"
        ? "/admin/projects?PageIndex=1&PageSize=500"
      : resourceKey === "news/list"
        ? "/admin/news"
        : "/admin/jobs";

  const result = await backendRequest(path, {}, sessionCookie);
  if (!result.response.ok) {
    throw new Error(
      `GET ${path} failed (HTTP ${result.response.status}).`,
    );
  }

  if (resourceKey === "projects/details") return [];
  return normalizeAdminApiRecords(resourceKey, result.body);
}

async function projectCategoryId(
  categoryName: string,
  sessionCookie: string,
) {
  if (!categoryName) return null;
  const result = await backendRequest("/project-categories", {}, sessionCookie);
  if (!result.response.ok) return null;
  const categories = asArray(unwrap(result.body)).map(asRecord);
  const found = categories.find(
    (category) => stringValue(category, "name") === categoryName,
  );
  return found ? stringValue(found, "id") : null;
}

function dataUrlToBlob(value: string) {
  const match = value.match(/^data:([^;,]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mime: match[1],
    bytes: Buffer.from(match[2], "base64"),
  };
}

async function uploadImageIfNeeded(
  value: unknown,
  sessionCookie: string,
) {
  if (typeof value !== "string" || !value.startsWith("data:image/")) {
    return typeof value === "string" ? value : "";
  }

  const parsed = dataUrlToBlob(value);
  if (!parsed) return value;

  const extension =
    parsed.mime === "image/png"
      ? "png"
      : parsed.mime === "image/webp"
        ? "webp"
        : parsed.mime === "image/svg+xml"
          ? "svg"
          : "jpg";

  const form = new FormData();
  form.append(
    "imageUrl",
    new Blob([parsed.bytes], { type: parsed.mime }),
    `admin-upload.${extension}`,
  );

  const result = await backendRequest(
    "/admin/upload",
    { method: "POST", body: form },
    sessionCookie,
  );
  if (!result.response.ok) {
    throw new Error(
      `Upload image failed (HTTP ${result.response.status}).`,
    );
  }

  const uploaded = unwrap(result.body);
  if (typeof uploaded === "string") return uploaded;
  const record = asRecord(uploaded);
  const url = stringValue(record, "url");
  if (!url) throw new Error("Upload image returned no URL.");
  return url;
}

async function buildHomeNodeValue(
  resourceKey: AdminApiResourceKey,
  input: AdminCrudRecord,
  sessionCookie: string,
) {
  if (resourceKey === "home/hero") {
    return {
      title: stringValue(input, "title"),
      description: stringValue(input, "description"),
      desktopImage: await uploadImageIfNeeded(
        input.desktopImage,
        sessionCookie,
      ),
      mobileImage: await uploadImageIfNeeded(input.mobileImage, sessionCookie),
      displayName: stringValue(input, "displayName"),
    };
  }

  if (resourceKey === "home/why-bmt") {
    return {
      title: stringValue(input, "title"),
      description: stringValue(input, "description"),
      defaultImage: await uploadImageIfNeeded(
        input.defaultImage,
        sessionCookie,
      ),
      mobileImage: await uploadImageIfNeeded(input.mobileImage, sessionCookie),
    };
  }

  if (resourceKey === "home/statistics") {
    const rawValue = input.value;
    const parsedValue =
      typeof rawValue === "number"
        ? rawValue
        : typeof rawValue === "string" && rawValue.trim()
          ? Number(rawValue)
          : 0;
    return {
      value: Number.isFinite(parsedValue) ? parsedValue : 0,
      label: stringValue(input, "label"),
      suffix: stringValue(input, "suffix"),
    };
  }

  if (resourceKey === "home/featured-services") {
    return {
      title: stringValue(input, "title"),
      description: stringValue(input, "description"),
      desktopImage: await uploadImageIfNeeded(
        input.desktopImage,
        sessionCookie,
      ),
      mobileImage: await uploadImageIfNeeded(input.mobileImage, sessionCookie),
    };
  }

  if (resourceKey === "home/trust-section-content") {
    return {
      titleDesktop: stringValue(input, "titleDesktop"),
      titleMobile: stringValue(input, "titleMobile"),
      descriptionDesktop: stringValue(input, "descriptionDesktop"),
      descriptionMobile: stringValue(input, "descriptionMobile"),
    };
  }

  if (resourceKey === "home/services-section-content") {
    return {
      title: stringValue(input, "title"),
      description: stringValue(input, "description"),
    };
  }

  if (resourceKey === "home/profile-section-content") {
    return {
      title: stringValue(input, "title"),
      subtitle: stringValue(input, "subtitle"),
      description: stringValue(input, "description"),
      oneBookImage: await uploadImageIfNeeded(
        input.oneBookImage,
        sessionCookie,
      ),
      threeBooksImage: await uploadImageIfNeeded(
        input.threeBooksImage,
        sessionCookie,
      ),
    };
  }

  if (resourceKey === "home/contact-form") {
    return {
      title: stringValue(input, "title"),
      subtitle: stringValue(input, "subtitle"),
      successMessage: stringValue(input, "successMessage"),
    };
  }

  throw new Error("Unsupported Home resource.");
}

async function saveHomeRecords(
  resourceKey: AdminApiResourceKey,
  records: AdminCrudRecord[],
  sessionCookie: string,
) {
  if (!isHomeAdminApiResourceKey(resourceKey)) {
    throw new Error("Unsupported Home resource.");
  }

  const items = [];
  for (const record of records) {
    if (!record.id) throw new Error("Missing Home node id.");
    items.push({
      id: record.id,
      value: await buildHomeNodeValue(resourceKey, record, sessionCookie),
    });
  }

  const result = await backendRequest(
    "/admin/pages/home/nodes",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    },
    sessionCookie,
  );

  if (!result.response.ok) {
    throw new Error(
      `Update Home nodes failed (HTTP ${result.response.status}).`,
    );
  }

  return fetchResourceRecords(resourceKey, sessionCookie);
}

async function fetchAboutContent(sessionCookie: string) {
  const result = await backendRequest(
    "/admin/pages/about",
    {},
    sessionCookie,
  );
  if (!result.response.ok) {
    throw new Error(
      `GET /admin/pages/about failed (HTTP ${result.response.status}).`,
    );
  }
  return getAboutContent(result.body);
}

async function saveAboutRecords(
  resourceKey: AdminApiResourceKey,
  records: AdminCrudRecord[],
  sessionCookie: string,
) {
  if (!isAboutAdminApiResourceKey(resourceKey)) {
    throw new Error("Unsupported About resource.");
  }

  const current = await fetchAboutContent(sessionCookie);
  if (!current) throw new Error("About page content is unavailable.");

  const currentHero = asRecord(current.hero);
  const currentJourney = asRecord(current.journey);
  const currentCoreValues = asRecord(current.coreValues);
  const currentCapabilities = asRecord(current.capabilities);

  let path = "";
  let payload: UnknownRecord = {};

  if (resourceKey === "about/hero") {
    const record = records[0];
    if (!record) throw new Error("Missing About hero data.");
    path = "/admin/pages/about/hero";
    payload = {
      eyebrow: stringValue(record, "eyebrow"),
      heading: stringValue(record, "heading"),
      description: stringValue(record, "description"),
      desktopImage: await uploadImageIfNeeded(
        record.desktopImage,
        sessionCookie,
      ),
      // Alt text is intentionally hidden from the admin UI. Preserve the
      // backend value instead of clearing it when other hero fields are saved.
      desktopAlt: stringValue(currentHero, "desktopAlt"),
    };
  } else if (
    resourceKey === "about/journey" ||
    resourceKey === "about/journey-section-content"
  ) {
    path = "/admin/pages/about/journey";
    const currentItems = asArray(currentJourney?.items);
    const items =
      resourceKey === "about/journey"
        ? records.map((record) => ({
            year: stringValue(record, "year"),
            title: stringValue(record, "title"),
            description: stringValue(record, "description"),
          }))
        : currentItems.map((raw) => {
            const item = asRecord(raw);
            return {
              year: stringValue(item, "year"),
              title: stringValue(item, "title"),
              description: stringValue(item, "description"),
            };
          });
    payload = {
      title:
        resourceKey === "about/journey-section-content"
          ? stringValue(records[0] ?? null, "title")
          : stringValue(currentJourney, "title"),
      items,
    };
  } else if (resourceKey === "about/vision-mission") {
    const record = records[0];
    if (!record) throw new Error("Missing About vision/mission data.");
    path = "/admin/pages/about/vision-mission";
    payload = {
      visionHeading: stringValue(record, "visionHeading"),
      visionDescription: stringValue(record, "visionDescription"),
      missionHeading: stringValue(record, "missionHeading"),
      missionDescription: stringValue(record, "missionDescription"),
    };
  } else if (
    resourceKey === "about/core-values" ||
    resourceKey === "about/core-values-section-content"
  ) {
    path = "/admin/pages/about/core-values";
    const currentItems = asArray(currentCoreValues?.items);
    const items =
      resourceKey === "about/core-values"
        ? await Promise.all(
            records.map(async (record, index) => {
              const previous = asRecord(currentItems[index]);
              return {
                title: stringValue(record, "title"),
                description: stringValue(record, "description"),
                image: await uploadImageIfNeeded(record.image, sessionCookie),
                // User requested removing alt editing. Keep the existing backend
                // value so saving title/description/image does not erase it.
                imageAlt:
                  stringValue(previous, "imageAlt") ||
                  stringValue(record, "title"),
              };
            }),
          )
        : currentItems.map((raw) => {
            const item = asRecord(raw);
            return {
              title: stringValue(item, "title"),
              description: stringValue(item, "description"),
              image: stringValue(item, "image"),
              imageAlt: stringValue(item, "imageAlt"),
            };
          });
    payload = {
      title:
        resourceKey === "about/core-values-section-content"
          ? stringValue(records[0] ?? null, "title")
          : stringValue(currentCoreValues, "title"),
      items,
    };
  } else if (
    resourceKey === "about/capabilities" ||
    resourceKey === "about/capabilities-section-content"
  ) {
    path = "/admin/pages/about/capabilities";
    const currentItems = asArray(currentCapabilities?.items);
    const items =
      resourceKey === "about/capabilities"
        ? records.map((record) => ({
            title: stringValue(record, "title"),
            mobileTitle: stringValue(record, "mobileTitle"),
            description: stringValue(record, "description"),
          }))
        : currentItems.map((raw) => {
            const item = asRecord(raw);
            return {
              title: stringValue(item, "title"),
              mobileTitle: stringValue(item, "mobileTitle"),
              description: stringValue(item, "description"),
            };
          });
    payload = {
      title:
        resourceKey === "about/capabilities-section-content"
          ? stringValue(records[0] ?? null, "title")
          : stringValue(currentCapabilities, "title"),
      items,
    };
  } else if (resourceKey === "about/contact-form") {
    const record = records[0];
    if (!record) throw new Error("Missing About contact form data.");
    path = "/admin/pages/about/contact-form";
    payload = {
      title: stringValue(record, "title"),
      description: stringValue(record, "description"),
      successMessage: stringValue(record, "successMessage"),
    };
  }

  if (!path) throw new Error("Unsupported About resource.");

  const result = await backendRequest(
    path,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    sessionCookie,
  );

  if (!result.response.ok) {
    throw new Error(
      `Update About section failed (HTTP ${result.response.status}).`,
    );
  }

  return fetchResourceRecords(resourceKey, sessionCookie);
}

async function fetchSiteSettings(sessionCookie: string) {
  const result = await backendRequest(
    "/admin/site-settings",
    {},
    sessionCookie,
  );
  if (!result.response.ok) {
    throw new Error(
      `GET /admin/site-settings failed (HTTP ${result.response.status}).`,
    );
  }
  return getSiteSettings(result.body);
}

async function saveSettingsRecords(
  resourceKey: AdminApiResourceKey,
  records: AdminCrudRecord[],
  sessionCookie: string,
) {
  if (!isSettingsAdminApiResourceKey(resourceKey)) {
    throw new Error("Unsupported Settings resource.");
  }

  const current = await fetchSiteSettings(sessionCookie);
  const currentPartners = asRecord(current?.partners);
  const currentItems = asArray(currentPartners?.items).map(asRecord);

  let path = "";
  let payload: UnknownRecord = {};

  if (resourceKey === "settings/branding") {
    const record = records[0];
    if (!record) throw new Error("Missing Settings header data.");
    path = "/admin/site-settings/header";
    payload = {
      logo: await uploadImageIfNeeded(record.logo, sessionCookie),
      logoAlt: stringValue(record, "logoAlt"),
    };
  } else if (
    resourceKey === "settings/partners" ||
    resourceKey === "settings/partners-section-content"
  ) {
    path = "/admin/site-settings/partners";
    const items =
      resourceKey === "settings/partners"
        ? await Promise.all(
            records.map(async (record, index) => ({
              id: stringValue(record, "id") || `partner-${index + 1}`,
              name: stringValue(record, "name"),
              logoImage: await uploadImageIfNeeded(
                record.logoImage,
                sessionCookie,
              ),
              logoAlt: stringValue(record, "logoAlt"),
              order: index + 1,
            })),
          )
        : currentItems.map((item, index) => ({
            id: stringValue(item, "id") || `partner-${index + 1}`,
            name: stringValue(item, "name"),
            logoImage: stringValue(item, "logoImage"),
            logoAlt: stringValue(item, "logoAlt"),
            order: index + 1,
          }));
    payload = {
      title:
        resourceKey === "settings/partners-section-content"
          ? stringValue(records[0] ?? null, "title")
          : stringValue(currentPartners, "title"),
      items,
    };
  } else if (resourceKey === "settings/footer") {
    const record = records[0];
    if (!record) throw new Error("Missing Settings footer data.");
    path = "/admin/site-settings/footer";
    payload = {
      footerLogo: await uploadImageIfNeeded(record.footerLogo, sessionCookie),
      footerLogoAlt: stringValue(record, "footerLogoAlt"),
      service1Label: stringValue(record, "service1Label"),
      service1Href: stringValue(record, "service1Href"),
      service2Label: stringValue(record, "service2Label"),
      service2Href: stringValue(record, "service2Href"),
      service3Label: stringValue(record, "service3Label"),
      service3Href: stringValue(record, "service3Href"),
      service4Label: stringValue(record, "service4Label"),
      service4Href: stringValue(record, "service4Href"),
      contactHeading: stringValue(record, "contactHeading"),
      officeAddress: stringValue(record, "officeAddress"),
      phone: stringValue(record, "phone"),
      email: stringValue(record, "email"),
      branchesHeading: stringValue(record, "branchesHeading"),
      branch1Address: stringValue(record, "branch1Address"),
      branch2Address: stringValue(record, "branch2Address"),
      workshopAddress: stringValue(record, "workshopAddress"),
      facebookUrl: stringValue(record, "facebookUrl"),
      tiktokUrl: stringValue(record, "tiktokUrl"),
      instagramUrl: stringValue(record, "instagramUrl"),
      linkedinUrl: stringValue(record, "linkedinUrl"),
      socialWidgetImage: await uploadImageIfNeeded(
        record.socialWidgetImage,
        sessionCookie,
      ),
      socialWidgetAlt: stringValue(record, "socialWidgetAlt"),
    };
  }

  if (!path) throw new Error("Unsupported Settings resource.");

  const result = await backendRequest(
    path,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    sessionCookie,
  );

  if (!result.response.ok) {
    throw new Error(
      `Update Settings section failed (HTTP ${result.response.status}).`,
    );
  }

  return fetchResourceRecords(resourceKey, sessionCookie);
}

async function saveProjectsPageRecords(
  resourceKey: AdminApiResourceKey,
  records: AdminCrudRecord[],
  sessionCookie: string,
) {
  if (!isProjectsPageAdminApiResourceKey(resourceKey)) {
    throw new Error("Unsupported Projects page resource.");
  }

  let path = "";
  let payload: UnknownRecord = {};

  if (resourceKey === "projects/page-hero") {
    const record = records[0];
    if (!record) throw new Error("Missing Projects hero data.");
    path = "/admin/pages/projects/hero";
    payload = {
      title: stringValue(record, "title"),
      description: stringValue(record, "description"),
      desktopImage: await uploadImageIfNeeded(
        record.desktopImage,
        sessionCookie,
      ),
      imageAlt: stringValue(record, "imageAlt"),
    };
  } else if (resourceKey === "projects/contact-form") {
    const record = records[0];
    if (!record) throw new Error("Missing Projects contact form data.");
    path = "/admin/pages/projects/contact-form";
    payload = {
      title: stringValue(record, "title"),
      description: stringValue(record, "description"),
      submitLabel: stringValue(record, "submitLabel"),
      successMessage: stringValue(record, "successMessage"),
    };
  }

  if (!path) throw new Error("Unsupported Projects page resource.");

  const result = await backendRequest(
    path,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    sessionCookie,
  );

  if (!result.response.ok) {
    throw new Error(
      `Update Projects section failed (HTTP ${result.response.status}).`,
    );
  }

  return fetchResourceRecords(resourceKey, sessionCookie);
}

async function saveNewsPageRecords(
  resourceKey: AdminApiResourceKey,
  records: AdminCrudRecord[],
  sessionCookie: string,
) {
  if (!isNewsPageAdminApiResourceKey(resourceKey)) {
    throw new Error("Unsupported News page resource.");
  }

  let path = "";
  let payload: UnknownRecord = {};

  if (resourceKey === "news/page-hero") {
    const record = records[0];
    if (!record) throw new Error("Missing News hero data.");
    path = "/admin/pages/news/hero";
    payload = {
      eyebrow: stringValue(record, "eyebrow"),
      title: stringValue(record, "title"),
      description: stringValue(record, "description"),
      ctaLabel: stringValue(record, "ctaLabel"),
      ctaHref: stringValue(record, "ctaHref"),
      desktopImage: await uploadImageIfNeeded(
        record.desktopImage,
        sessionCookie,
      ),
      imageAlt: stringValue(record, "imageAlt"),
    };
  } else if (resourceKey === "news/featured-section-content") {
    const record = records[0];
    if (!record) throw new Error("Missing News featured section data.");
    path = "/admin/pages/news/featured-section";
    payload = { title: stringValue(record, "title") };
  } else if (resourceKey === "news/contact-form") {
    const record = records[0];
    if (!record) throw new Error("Missing News contact form data.");
    path = "/admin/pages/news/contact-form";
    payload = {
      title: stringValue(record, "title"),
      description: stringValue(record, "description"),
      submitLabel: stringValue(record, "submitLabel"),
      successMessage: stringValue(record, "successMessage"),
    };
  }

  if (!path) throw new Error("Unsupported News page resource.");

  const result = await backendRequest(
    path,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    sessionCookie,
  );

  if (!result.response.ok) {
    throw new Error(
      `Update News section failed (HTTP ${result.response.status}).`,
    );
  }

  return fetchResourceRecords(resourceKey, sessionCookie);
}

async function saveRecruitmentPageRecords(
  resourceKey: AdminApiResourceKey,
  records: AdminCrudRecord[],
  sessionCookie: string,
) {
  if (!isRecruitmentPageAdminApiResourceKey(resourceKey)) {
    throw new Error("Unsupported Recruitment page resource.");
  }

  let path = "";
  let payload: UnknownRecord = {};

  if (resourceKey === "recruitment/hero") {
    const record = records[0];
    if (!record) throw new Error("Missing Recruitment hero data.");
    path = "/admin/pages/recruitment/hero";
    payload = {
      title: stringValue(record, "title"),
      description: stringValue(record, "description"),
      ctaLabel: stringValue(record, "ctaLabel"),
      ctaHref: stringValue(record, "ctaHref"),
      desktopImage: await uploadImageIfNeeded(
        record.desktopImage,
        sessionCookie,
      ),
      desktopAlt: stringValue(record, "desktopAlt"),
    };
  } else if (resourceKey === "recruitment/jobs-section-content") {
    const record = records[0];
    if (!record) throw new Error("Missing Recruitment jobs section data.");
    path = "/admin/pages/recruitment/jobs-section";
    payload = { title: stringValue(record, "title") };
  } else if (resourceKey === "recruitment/contact-form") {
    const record = records[0];
    if (!record) throw new Error("Missing Recruitment contact form data.");
    path = "/admin/pages/recruitment/contact-form";
    // Response thật của GET /admin/pages/recruitment chỉ trả 4 field này cho
    // contactForm (không có nameLabel/phoneLabel/...); gửi đúng 4 field để
    // khớp DTO thật của BE, tránh bị từ chối field ngoài DTO.
    payload = {
      title: stringValue(record, "title"),
      description: stringValue(record, "description"),
      submitLabel: stringValue(record, "submitLabel"),
      successMessage: stringValue(record, "successMessage"),
    };
  }

  if (!path) throw new Error("Unsupported Recruitment page resource.");

  const result = await backendRequest(
    path,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    sessionCookie,
  );

  if (!result.response.ok) {
    throw new Error(
      `Update Recruitment section failed (HTTP ${result.response.status}).`,
    );
  }

  return fetchResourceRecords(resourceKey, sessionCookie);
}

async function fetchSingleRecord(
  resourceKey: AdminApiResourceKey,
  id: string,
  sessionCookie: string,
) {
  if (
    isHomeAdminApiResourceKey(resourceKey) ||
    isAboutAdminApiResourceKey(resourceKey) ||
    isSettingsAdminApiResourceKey(resourceKey) ||
    isProjectsPageAdminApiResourceKey(resourceKey) ||
    isNewsPageAdminApiResourceKey(resourceKey) ||
    isRecruitmentPageAdminApiResourceKey(resourceKey) ||
    isContactPageAdminApiResourceKey(resourceKey)
  ) {
    const records = await fetchResourceRecords(resourceKey, sessionCookie);
    return records.find((record) => record.id === id) ?? null;
  }

  const path =
    resourceKey === "projects/list" || resourceKey === "projects/details"
      ? `/admin/projects/${id}`
      : resourceKey === "news/list"
        ? `/admin/news/${id}`
        : `/admin/jobs/${id}`;

  const result = await backendRequest(path, {}, sessionCookie);
  if (!result.response.ok) return null;

  const records = normalizeAdminApiRecords(resourceKey, [unwrap(result.body)]);
  return records[0] ?? null;
}

export async function mutateAdminApiResource({
  resourceKey,
  method,
  id,
  input,
}: {
  resourceKey: AdminApiResourceKey;
  method: "POST" | "PATCH" | "DELETE";
  id?: string;
  input?: AdminCrudRecord;
}) {
  if (!(await requireLocalAdminSession())) {
    throw new Error("Unauthorized.");
  }

  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("API_CLIENT is not configured.");
  const sessionCookie = await backendLogin(baseUrl);

  if (isHomeAdminApiResourceKey(resourceKey)) {
    if (method !== "PATCH") {
      throw new Error("Home nodes are fixed and only support updates.");
    }
    if (!id || !input) throw new Error("Missing Home node data.");

    const savedRecords = await saveHomeRecords(
      resourceKey,
      [{ ...input, id }],
      sessionCookie,
    );
    return (
      savedRecords.find((record) => record.id === id) ?? {
        ...input,
        id,
      }
    );
  }

  if (isAboutAdminApiResourceKey(resourceKey)) {
    if (method !== "PATCH") {
      throw new Error("About sections are fixed and only support updates.");
    }
    if (!id || !input) throw new Error("Missing About section data.");

    const currentRecords = await fetchResourceRecords(
      resourceKey,
      sessionCookie,
    );
    const nextRecords = currentRecords.map((record) =>
      record.id === id ? { ...record, ...input, id } : record,
    );
    if (!nextRecords.some((record) => record.id === id)) {
      throw new Error("About record not found.");
    }

    const savedRecords = await saveAboutRecords(
      resourceKey,
      nextRecords,
      sessionCookie,
    );
    return (
      savedRecords.find((record) => record.id === id) ?? {
        ...input,
        id,
      }
    );
  }

  if (isSettingsAdminApiResourceKey(resourceKey)) {
    if (method !== "PATCH") {
      throw new Error("Settings sections are fixed and only support updates.");
    }
    if (!id || !input) throw new Error("Missing Settings section data.");

    const currentRecords = await fetchResourceRecords(
      resourceKey,
      sessionCookie,
    );
    const nextRecords = currentRecords.map((record) =>
      record.id === id ? { ...record, ...input, id } : record,
    );
    if (!nextRecords.some((record) => record.id === id)) {
      throw new Error("Settings record not found.");
    }

    const savedRecords = await saveSettingsRecords(
      resourceKey,
      nextRecords,
      sessionCookie,
    );
    return (
      savedRecords.find((record) => record.id === id) ?? {
        ...input,
        id,
      }
    );
  }

  if (
    isProjectsPageAdminApiResourceKey(resourceKey) ||
    isNewsPageAdminApiResourceKey(resourceKey) ||
    isRecruitmentPageAdminApiResourceKey(resourceKey) ||
    isContactPageAdminApiResourceKey(resourceKey)
  ) {
    if (method !== "PATCH") {
      throw new Error("Page sections are fixed and only support updates.");
    }
    if (!id || !input) throw new Error("Missing page section data.");

    const currentRecords = await fetchResourceRecords(
      resourceKey,
      sessionCookie,
    );
    const nextRecords = currentRecords.map((record) =>
      record.id === id ? { ...record, ...input, id } : record,
    );
    if (!nextRecords.some((record) => record.id === id)) {
      throw new Error("Page record not found.");
    }

    const saveFn = isProjectsPageAdminApiResourceKey(resourceKey)
      ? saveProjectsPageRecords
      : isNewsPageAdminApiResourceKey(resourceKey)
        ? saveNewsPageRecords
        : isContactPageAdminApiResourceKey(resourceKey)
          ? saveContactPageRecords
          : saveRecruitmentPageRecords;

    const savedRecords = await saveFn(resourceKey, nextRecords, sessionCookie);
    return (
      savedRecords.find((record) => record.id === id) ?? {
        ...input,
        id,
      }
    );
  }

  if (method === "DELETE") {
    if (!id) throw new Error("Missing record id.");
    const path =
      resourceKey === "projects/list"
        ? `/admin/projects/${id}`
        : resourceKey === "news/list"
          ? `/admin/news/${id}`
          : `/admin/jobs/${id}`;
    const result = await backendRequest(
      path,
      { method: "DELETE" },
      sessionCookie,
    );
    if (!result.response.ok) {
      throw new Error(
        `DELETE ${path} failed (HTTP ${result.response.status}).`,
      );
    }
    return null;
  }

  if (!input) throw new Error("Missing record input.");

  if (resourceKey === "projects/list") {
    const categoryId =
      stringValue(input, "categoryId") ||
      (await projectCategoryId(stringValue(input, "category"), sessionCookie));
    const thumbnail = await uploadImageIfNeeded(input.thumbnail, sessionCookie);
    const highlight = Boolean(input.highlight);

    if (method === "POST") {
      const result = await backendRequest(
        "/admin/projects",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardTitle: stringValue(input, "title"),
            title: stringValue(input, "title"),
            categoryId: categoryId || null,
            category: stringValue(input, "category"),
            cardImageUrl: thumbnail,
            thumbnail,
            highlight,
          }),
        },
        sessionCookie,
      );
      if (!result.response.ok) {
        throw new Error(
          `Create project failed (HTTP ${result.response.status}).`,
        );
      }
      const created = asRecord(unwrap(result.body));
      const createdId = stringValue(created, "id");
      return createdId
        ? (await fetchSingleRecord(resourceKey, createdId, sessionCookie)) ??
            normalizeAdminApiRecords(resourceKey, [created])[0]
        : normalizeAdminApiRecords(resourceKey, [created])[0];
    }

    if (!id) throw new Error("Missing project id.");
    const cardResult = await backendRequest(
      `/admin/projects/${id}/card`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: stringValue(input, "title"),
          categoryId: categoryId || null,
          category: stringValue(input, "category"),
          imageUrl: thumbnail,
          thumbnail,
          highlight,
        }),
      },
      sessionCookie,
    );
    if (!cardResult.response.ok) {
      throw new Error(
        `Update project card failed (HTTP ${cardResult.response.status}).`,
      );
    }

    const featuredResult = await backendRequest(
      `/admin/projects/${id}/featured`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: highlight }),
      },
      sessionCookie,
    );
    if (!featuredResult.response.ok) {
      throw new Error(
        `Update project featured failed (HTTP ${featuredResult.response.status}).`,
      );
    }

    return (
      (await fetchSingleRecord(resourceKey, id, sessionCookie)) ?? {
        ...input,
        id,
        thumbnail,
      }
    );
  }

  if (resourceKey === "projects/details") {
    if (method === "POST") {
      throw new Error("Project detail is created through the project record.");
    }
    if (!id) throw new Error("Missing project id.");

    const imageKeys = [
      "heroImage",
      "wordmarkImage",
      "drawingImage",
      ...Array.from({ length: 3 }, (_, index) => `survey${index + 1}Image`),
      ...Array.from({ length: 6 }, (_, index) => `render${index + 1}Image`),
      ...Array.from({ length: 4 }, (_, index) => `process${index + 1}Image`),
      ...Array.from({ length: 3 }, (_, index) => [
        `comparison${index + 1}BeforeImage`,
        `comparison${index + 1}AfterImage`,
      ]).flat(),
    ];

    const uploadedImages: Record<string, string> = {};
    for (const key of imageKeys) {
      uploadedImages[key] = await uploadImageIfNeeded(input[key], sessionCookie);
    }

    const rawYear = input.year;
    const parsedYear =
      typeof rawYear === "number"
        ? rawYear
        : typeof rawYear === "string" && rawYear.trim()
          ? Number(rawYear)
          : null;

    const payload = {
      overview: {
        title: stringValue(input, "title"),
        projectName: stringValue(input, "projectName"),
        category: stringValue(input, "category"),
        location: stringValue(input, "location"),
        client: stringValue(input, "client"),
        area: stringValue(input, "area"),
        style: stringValue(input, "style"),
        year:
          typeof parsedYear === "number" && Number.isFinite(parsedYear)
            ? parsedYear
            : null,
        scale: stringValue(input, "scale"),
        heroImage: uploadedImages.heroImage,
        wordmarkImage: uploadedImages.wordmarkImage,
        description: stringValue(input, "description"),
      },
      survey: {
        survey1Image: uploadedImages.survey1Image,
        survey2Image: uploadedImages.survey2Image,
        survey3Image: uploadedImages.survey3Image,
        surveyDescription: stringValue(input, "surveyDescription"),
      },
      solution: {
        drawingCaption: stringValue(input, "drawingCaption"),
        solutionDescription: stringValue(input, "solutionDescription"),
        drawingImage: uploadedImages.drawingImage,
      },
      renders: {
        render1Image: uploadedImages.render1Image,
        render2Image: uploadedImages.render2Image,
        render3Image: uploadedImages.render3Image,
        render4Image: uploadedImages.render4Image,
        render5Image: uploadedImages.render5Image,
        render6Image: uploadedImages.render6Image,
        galleryDescription: stringValue(input, "galleryDescription"),
      },
      process: {
        process1Label: stringValue(input, "process1Label"),
        process1Image: uploadedImages.process1Image,
        process2Label: stringValue(input, "process2Label"),
        process2Image: uploadedImages.process2Image,
        process3Label: stringValue(input, "process3Label"),
        process3Image: uploadedImages.process3Image,
        process4Label: stringValue(input, "process4Label"),
        process4Image: uploadedImages.process4Image,
        processDescription: stringValue(input, "processDescription"),
      },
      comparisons: {
        comparison1BeforeLabel: stringValue(input, "comparison1BeforeLabel"),
        comparison1BeforeImage: uploadedImages.comparison1BeforeImage,
        comparison1AfterLabel: stringValue(input, "comparison1AfterLabel"),
        comparison1AfterImage: uploadedImages.comparison1AfterImage,
        comparison2BeforeLabel: stringValue(input, "comparison2BeforeLabel"),
        comparison2BeforeImage: uploadedImages.comparison2BeforeImage,
        comparison2AfterLabel: stringValue(input, "comparison2AfterLabel"),
        comparison2AfterImage: uploadedImages.comparison2AfterImage,
        comparison3BeforeLabel: stringValue(input, "comparison3BeforeLabel"),
        comparison3BeforeImage: uploadedImages.comparison3BeforeImage,
        comparison3AfterLabel: stringValue(input, "comparison3AfterLabel"),
        comparison3AfterImage: uploadedImages.comparison3AfterImage,
      },
      contactForm: {
        ctaTitle: stringValue(input, "ctaTitle"),
        ctaDescription: stringValue(input, "ctaDescription"),
        ctaSuccessMessage: stringValue(input, "ctaSuccessMessage"),
      },
    };

    const result = await backendRequest(
      `/admin/projects/${id}/detail`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      sessionCookie,
    );

    if (!result.response.ok) {
      throw new Error(
        `Update project detail failed (HTTP ${result.response.status}).`,
      );
    }

    return (
      (await fetchSingleRecord(resourceKey, id, sessionCookie)) ?? {
        ...input,
        id,
      }
    );
  }

  if (resourceKey === "news/list") {
    const detailLoaded = input.__apiDetailLoaded === true;
    const current =
      method === "PATCH" && id && !detailLoaded
        ? await fetchSingleRecord(resourceKey, id, sessionCookie)
        : null;
    const desktopImage = await uploadImageIfNeeded(
      input.desktopImage,
      sessionCookie,
    );
    const payload = {
      title: stringValue(input, "title"),
      excerpt: stringValue(input, "excerpt"),
      imageUrl: desktopImage,
      desktopImage,
      body: detailLoaded
        ? stringValue(input, "body")
        : stringValue(current, "body") || stringValue(input, "body"),
      featured: Boolean(input.featured),
      highlightHome: Boolean(input.highlightHome),
    };
    const path = method === "POST" ? "/admin/news" : `/admin/news/${id}`;
    const result = await backendRequest(
      path,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      sessionCookie,
    );
    if (!result.response.ok) {
      throw new Error(
        `${method} news failed (HTTP ${result.response.status}).`,
      );
    }
    const saved = asRecord(unwrap(result.body));
    const savedId = stringValue(saved, "id") || id || "";
    return savedId
      ? (await fetchSingleRecord(resourceKey, savedId, sessionCookie)) ?? {
          ...input,
          id: savedId,
          desktopImage,
        }
      : normalizeAdminApiRecords(resourceKey, [saved])[0];
  }

  const detailLoaded = input.__apiDetailLoaded === true;
  const current =
    method === "PATCH" && id && !detailLoaded
      ? await fetchSingleRecord(resourceKey, id, sessionCookie)
      : null;
  const image = await uploadImageIfNeeded(
    stringValue(input, "image") || stringValue(current, "image"),
    sessionCookie,
  );
  const payload = {
    title: stringValue(input, "title"),
    department: detailLoaded
      ? stringValue(input, "department")
      : stringValue(current, "department") || stringValue(input, "department"),
    location: detailLoaded
      ? stringValue(input, "location")
      : stringValue(current, "location") || stringValue(input, "location"),
    schedule: detailLoaded
      ? stringValue(input, "schedule")
      : stringValue(current, "schedule") || stringValue(input, "schedule"),
    compensation: detailLoaded
      ? stringValue(input, "compensation")
      : stringValue(current, "compensation") ||
        stringValue(input, "compensation"),
    summary: detailLoaded
      ? stringValue(input, "summary")
      : stringValue(current, "summary") || stringValue(input, "summary"),
    image,
    responsibilities: detailLoaded
      ? stringValue(input, "responsibilities")
      : stringValue(current, "responsibilities") ||
        stringValue(input, "responsibilities"),
    benefits: detailLoaded
      ? stringValue(input, "benefits")
      : stringValue(current, "benefits") || stringValue(input, "benefits"),
  };
  const path = method === "POST" ? "/admin/jobs" : `/admin/jobs/${id}`;
  const result = await backendRequest(
    path,
    {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    sessionCookie,
  );
  if (!result.response.ok) {
    throw new Error(
      `${method} job failed (HTTP ${result.response.status}).`,
    );
  }
  const saved = asRecord(unwrap(result.body));
  const savedId = stringValue(saved, "id") || id || "";
  return savedId
    ? (await fetchSingleRecord(resourceKey, savedId, sessionCookie)) ?? {
        ...input,
        id: savedId,
        image,
      }
    : normalizeAdminApiRecords(resourceKey, [saved])[0];
}

export async function loadAdminApiResource(resourceKey: AdminApiResourceKey) {
  if (!(await requireLocalAdminSession())) {
    throw new Error("Unauthorized.");
  }
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("API_CLIENT is not configured.");
  const sessionCookie = await backendLogin(baseUrl);
  return fetchResourceRecords(resourceKey, sessionCookie);
}

export async function replaceAdminApiResource(
  resourceKey: AdminApiResourceKey,
  records: AdminCrudRecord[],
) {
  if (!(await requireLocalAdminSession())) {
    throw new Error("Unauthorized.");
  }
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("API_CLIENT is not configured.");
  const sessionCookie = await backendLogin(baseUrl);
  if (isHomeAdminApiResourceKey(resourceKey)) {
    return saveHomeRecords(resourceKey, records, sessionCookie);
  }
  if (isAboutAdminApiResourceKey(resourceKey)) {
    return saveAboutRecords(resourceKey, records, sessionCookie);
  }
  if (isSettingsAdminApiResourceKey(resourceKey)) {
    return saveSettingsRecords(resourceKey, records, sessionCookie);
  }
  if (isProjectsPageAdminApiResourceKey(resourceKey)) {
    return saveProjectsPageRecords(resourceKey, records, sessionCookie);
  }
  if (isNewsPageAdminApiResourceKey(resourceKey)) {
    return saveNewsPageRecords(resourceKey, records, sessionCookie);
  }
  if (isContactPageAdminApiResourceKey(resourceKey)) return saveContactPageRecords(resourceKey, records, sessionCookie);
  if (isRecruitmentPageAdminApiResourceKey(resourceKey)) {
    return saveRecruitmentPageRecords(resourceKey, records, sessionCookie);
  }
  throw new Error("Bulk replace is only supported for fixed page resources.");
}

export async function loadAdminApiRecord(
  resourceKey: AdminApiResourceKey,
  id: string,
) {
  if (!(await requireLocalAdminSession())) {
    throw new Error("Unauthorized.");
  }
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("API_CLIENT is not configured.");
  const sessionCookie = await backendLogin(baseUrl);
  const record = await fetchSingleRecord(resourceKey, id, sessionCookie);
  if (!record) {
    throw new Error("Admin record not found.");
  }
  return {
    ...record,
    __apiDetailLoaded: true,
  };
}

function normalizeContactRecords(resourceKey: AdminApiResourceKey, value: unknown): AdminCrudRecord[] {
  const page = asRecord(unwrap(value));
  const content = asRecord(page?.content) ?? page;
  const section = resourceKey === "contacts/hero" ? "hero" : resourceKey === "contacts/form" ? "contactForm" : "map";
  const record = asRecord(content?.[section]);
  if (!record) return [];
  const fields = section === "hero" ? ["title", "description", "photo", "photoAlt", "ctaLabel", "ctaHref"] : section === "contactForm" ? ["title", "description", "successMessage", "submitLabel"] : ["title", "googleMapsUrl"];
  return [{ id: resourceKey.replace("contacts/", "contact-"), ...Object.fromEntries(fields.map(key => [key, stringValue(record, key)])) }];
}

async function saveContactPageRecords(resourceKey: AdminApiResourceKey, records: AdminCrudRecord[], sessionCookie: string) {
  if (!isContactPageAdminApiResourceKey(resourceKey)) throw new Error("Unsupported Contact resource.");
  const record = records[0];
  if (!record) throw new Error("Missing Contact section data.");
  const section = resourceKey.slice("contacts/".length);
  const payload: UnknownRecord = section === "hero"
    ? { title: stringValue(record, "title"), description: stringValue(record, "description"), photo: await uploadImageIfNeeded(record.photo, sessionCookie), photoAlt: stringValue(record, "photoAlt") }
    : section === "form"
      ? { title: stringValue(record, "title"), description: stringValue(record, "description"), successMessage: stringValue(record, "successMessage") }
      : { title: stringValue(record, "title"), googleMapsUrl: stringValue(record, "googleMapsUrl") };
  const result = await backendRequest("/admin/pages/contact/" + section, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  }, sessionCookie);
  const envelope = asRecord(result.body);
  if (!result.response.ok || envelope?.isSuccess === false || envelope?.isFailed === true) throw new Error("Update Contact section failed.");
  return fetchResourceRecords(resourceKey, sessionCookie);
}

function normalizeFormSubmissionItem(raw: unknown): FormSubmissionItem | null {
  const item = asRecord(raw);
  const id = stringValue(item, "id");
  if (!item || !id) return null;
  return {
    id,
    customerName: stringValue(item, "customerName"),
    phone: stringValue(item, "phone"),
    status: stringValue(item, "status") === "done" ? "done" : "pending",
    createdAt: stringValue(item, "createdAt"),
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : null,
  };
}

export async function loadFormSubmissions(params: {
  pageIndex?: number;
  pageSize?: number;
  status?: FormSubmissionStatus;
} = {}): Promise<FormSubmissionsPage> {
  if (!(await requireLocalAdminSession())) {
    throw new Error("Unauthorized.");
  }
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("API_CLIENT is not configured.");
  const sessionCookie = await backendLogin(baseUrl);

  const query = new URLSearchParams();
  query.set("pageIndex", String(params.pageIndex ?? 1));
  query.set("pageSize", String(params.pageSize ?? 100));
  if (params.status) query.set("status", params.status);

  const result = await backendRequest(
    `/admin/form-submissions?${query.toString()}`,
    {},
    sessionCookie,
  );
  if (!result.response.ok) {
    throw new Error(
      `GET /admin/form-submissions failed (HTTP ${result.response.status}).`,
    );
  }

  const page = asRecord(unwrap(result.body));
  const items = asArray(page?.items)
    .map(normalizeFormSubmissionItem)
    .filter((item): item is FormSubmissionItem => item !== null);

  return {
    items,
    pageIndex: numberValue(page, "pageIndex") || 1,
    pageSize: numberValue(page, "pageSize") || items.length,
    totalCount: numberValue(page, "totalCount") || items.length,
    hasNextPage: booleanValue(page, "hasNextPage"),
    hasPreviousPage: booleanValue(page, "hasPreviousPage"),
  };
}

export async function updateFormSubmissionStatus(
  id: string,
  status: FormSubmissionStatus,
): Promise<FormSubmissionItem> {
  if (!(await requireLocalAdminSession())) {
    throw new Error("Unauthorized.");
  }
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("API_CLIENT is not configured.");
  const sessionCookie = await backendLogin(baseUrl);

  const result = await backendRequest(
    `/admin/form-submissions/${id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
    sessionCookie,
  );
  if (!result.response.ok) {
    throw new Error(
      `Update form submission status failed (HTTP ${result.response.status}).`,
    );
  }
  const item = normalizeFormSubmissionItem(unwrap(result.body));
  if (!item) throw new Error("Invalid form submission response.");
  return item;
}

export async function deleteFormSubmission(id: string): Promise<void> {
  if (!(await requireLocalAdminSession())) {
    throw new Error("Unauthorized.");
  }
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("API_CLIENT is not configured.");
  const sessionCookie = await backendLogin(baseUrl);

  const result = await backendRequest(
    `/admin/form-submissions/${id}`,
    { method: "DELETE" },
    sessionCookie,
  );
  if (!result.response.ok && result.response.status !== 204) {
    throw new Error(
      `Delete form submission failed (HTTP ${result.response.status}).`,
    );
  }
}
