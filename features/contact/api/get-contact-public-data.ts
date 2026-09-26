import type { ContactPublicData } from "@/features/contact/types/contact-public";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function stringValue(record: UnknownRecord | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : "";
}

export function emptyContactPublicData(): ContactPublicData {
  return {
    hero: {
      title: "",
      description: "",
      ctaLabel: "",
      ctaHref: "",
      photo: "",
      photoAlt: "",
    },
    contactForm: {
      title: "",
      description: "",
      submitLabel: "",
      successMessage: "",
    },
    map: {
      title: "",
      googleMapsUrl: "",
    },
  };
}

export function buildContactPublicData(value: unknown): ContactPublicData {
  const page = asRecord(value);
  const content = asRecord(page?.content);
  const hero = asRecord(content?.hero);
  const contactForm =
    asRecord(content?.contactForm) ?? asRecord(content?.form);
  const map = asRecord(content?.map);

  return {
    hero: {
      title: stringValue(hero, "title"),
      description: stringValue(hero, "description"),
      ctaLabel: stringValue(hero, "ctaLabel"),
      ctaHref: stringValue(hero, "ctaHref"),
      photo: stringValue(hero, "photo"),
      photoAlt: stringValue(hero, "photoAlt"),
    },
    contactForm: {
      title: stringValue(contactForm, "title"),
      description: stringValue(contactForm, "description"),
      submitLabel: stringValue(contactForm, "submitLabel"),
      successMessage: stringValue(contactForm, "successMessage"),
    },
    map: {
      title: stringValue(map, "title"),
      googleMapsUrl: stringValue(map, "googleMapsUrl"),
    },
  };
}
