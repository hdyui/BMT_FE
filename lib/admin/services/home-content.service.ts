import { mockHomeHeroSlides } from "@/lib/admin/mock-data/home";
import type { HomeHeroSlideContent } from "@/lib/admin/types/content";

export const homeContentService = {
  async getHeroSlides(): Promise<HomeHeroSlideContent[]> {
    return structuredClone(mockHomeHeroSlides);
  },

  async saveHeroSlide(
    slide: HomeHeroSlideContent,
  ): Promise<HomeHeroSlideContent> {
    // TODO: Replace with real persistence/backend implementation.
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    return structuredClone(slide);
  },
};
