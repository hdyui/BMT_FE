export type RelatedProjectData = {
  title: string;
  image: string;
  href: string;
};

export const relatedProjectsSection = {
  title: "Tham khảo dự án liên quan",
} as const;

export const relatedProjects: RelatedProjectData[] = [
  {
    title: "Chung cư La Astoria Q.2",
    image: "/images/projects/project-03.png",
    href: "/projects/chung-cu-la-astoria-q2",
  },
  {
    title: "Căn hộ The Opera Residence",
    image: "/images/projects/project-05.png",
    href: "/projects/can-ho-the-opera-residence",
  },
  {
    title: "Nhà phố 2 tầng Quận 9",
    image: "/images/projects/project-06.png",
    href: "/projects/nha-pho-2-tang-quan-9",
  },
  {
    title: "Nhà phố Bình Chánh",
    image: "/images/projects/project-07.png",
    href: "/projects/nha-pho-binh-chanh",
  },
  {
    title: "Căn hộ chung cư Q9",
    image: "/images/projects/project-08.png",
    href: "/projects/can-ho-chung-cu-q9",
  },
  {
    title: "Căn hộ chung cư Q7",
    image: "/images/projects/project-09.png",
    href: "/projects/can-ho-chung-cu-q7",
  },
];
