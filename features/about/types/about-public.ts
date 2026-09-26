import type { AboutCapability } from "@/features/about/data/about-content";

export type AboutHeroContent = {
  eyebrow: string;
  heading: string;
  description: string;
  desktopImage: string;
  desktopAlt?: string;
};

export type AboutJourneyItem = {
  year: string;
  title: string;
  description: string;
  image: string;
};

export type AboutJourneyContent = {
  title: string;
  items: AboutJourneyItem[];
};

export type AboutVisionMissionContent = {
  visionHeading: string;
  visionDescription: string;
  missionHeading: string;
  missionDescription: string;
};

export type AboutCoreValue = {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
};

export type AboutCoreValuesContent = {
  title: string;
  items: AboutCoreValue[];
};

export type AboutCapabilitiesContent = {
  title: string;
  items: AboutCapability[];
};

export type AboutContactFormContent = {
  title: string;
  description?: string;
  successMessage: string;
};

export type AboutPublicData = {
  hero: AboutHeroContent;
  journey: AboutJourneyContent;
  visionMission: AboutVisionMissionContent;
  coreValues: AboutCoreValuesContent;
  capabilities: AboutCapabilitiesContent;
  contactForm: AboutContactFormContent;
};
