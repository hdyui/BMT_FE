import { mockProjectContent } from "@/features/admin/lib/mock-data/projects";
import type {
  AdminProjectCard,
  AdminProjectDetailContent,
  ProjectContentBundle,
} from "@/features/admin/lib/types/content";

export const projectContentService = {
  async getAll(): Promise<ProjectContentBundle> {
    return structuredClone(mockProjectContent);
  },

  async saveCard(card: AdminProjectCard): Promise<AdminProjectCard> {
    // TODO: Replace with real persistence/backend implementation.
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    return structuredClone(card);
  },

  async saveDetail(
    detail: AdminProjectDetailContent,
  ): Promise<AdminProjectDetailContent> {
    // TODO: Replace with real persistence/backend implementation.
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    return structuredClone(detail);
  },
};
