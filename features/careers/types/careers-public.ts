export type CareerJob = {
  id: string;
  title: string;
  department: string;
  location: string;
  schedule: string;
  compensation: string;
  summary: string;
  image: string;
  responsibilities: string[];
  benefits: string[];
};

export type CareersPageContent = {
  hero: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    desktopImage: string;
    desktopAlt: string;
  };
  jobsSection: {
    title: string;
  };
  contactForm: {
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    submitLabel: string;
    requiredMessage: string;
    successMessage: string;
  };
};

export type CareersPublicData = {
  jobs: CareerJob[];
  page: CareersPageContent;
};
