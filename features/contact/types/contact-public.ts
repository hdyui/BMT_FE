export type ContactHeroContent = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  photo: string;
  photoAlt: string;
};

export type ContactFormContent = {
  title: string;
  description: string;
  submitLabel: string;
  successMessage: string;
};

export type ContactMapContent = {
  title: string;
  googleMapsUrl: string;
};

export type ContactPublicData = {
  hero: ContactHeroContent;
  contactForm: ContactFormContent;
  map: ContactMapContent;
};
