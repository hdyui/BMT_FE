export type SiteHeaderSettings = {
  logo: string | null;
  logoAlt: string | null;
};

export type SitePartnerSettings = {
  id: string | null;
  name: string | null;
  logoImage: string | null;
  logoAlt: string | null;
  order: number;
};

export type SitePartnersSettings = {
  title: string | null;
  items: SitePartnerSettings[];
};

export type SiteFooterSettings = {
  footerLogo: string | null;
  footerLogoAlt: string | null;
  service1Label: string | null;
  service1Href: string | null;
  service2Label: string | null;
  service2Href: string | null;
  service3Label: string | null;
  service3Href: string | null;
  service4Label: string | null;
  service4Href: string | null;
  contactHeading: string | null;
  officeAddress: string | null;
  phone: string | null;
  email: string | null;
  branchesHeading: string | null;
  branch1Address: string | null;
  branch2Address: string | null;
  workshopAddress: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  socialWidgetImage: string | null;
  socialWidgetAlt: string | null;
};

export type SiteSettings = {
  header: SiteHeaderSettings;
  partners: SitePartnersSettings;
  footer: SiteFooterSettings;
};
