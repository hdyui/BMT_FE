"use client";

import { useState } from "react";
import {
  FolderKanban,
  Images,
  LayoutList,
  ListTree,
  Plus,
} from "lucide-react";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ProjectDetailEditor } from "@/features/admin/projects/ProjectDetailEditor";
import { ProjectListPanel } from "@/features/admin/projects/ProjectListPanel";
import { ProjectTaxonomyPanel } from "@/features/admin/projects/ProjectTaxonomyPanel";
import { RelatedProjectsPanel } from "@/features/admin/projects/RelatedProjectsPanel";
import type { ProjectContentBundle } from "@/features/admin/lib/types/content";
import { Button } from "@/features/admin/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/admin/components/ui/tabs";

type ProjectTab = "list" | "categories" | "details" | "related";

const tabs = [
  { value: "list", label: "Danh sách", icon: LayoutList },
  { value: "categories", label: "Danh mục", icon: ListTree },
  { value: "details", label: "Chi tiết", icon: FolderKanban },
  { value: "related", label: "Liên quan", icon: Images },
] as const;

export function ProjectsContentManager({
  initialContent,
}: {
  initialContent: ProjectContentBundle;
}) {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<ProjectTab>("list");
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Nội dung Dự án"
        description="Quản lý danh sách, danh mục, nội dung chi tiết và các dự án liên quan."
        actions={
          activeTab === "list" ? (
            <Button
              className="h-10 px-4"
              onClick={() => setCreateOpen(true)}
            >
              <Plus /> Thêm dự án
            </Button>
          ) : undefined
        }
      />
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProjectTab)} className="mt-6">
        <div className="admin-scrollbar overflow-x-auto">
          <TabsList className="h-auto min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
              >
                <Icon className="size-4" strokeWidth={1.8} />
                {tab.label}
              </TabsTrigger>
            );
          })}
          </TabsList>
        </div>

        <TabsContent value="list" className="mt-5">
          <ProjectListPanel
            cards={content.cards}
            categories={content.categories.map((category) => category.label)}
            createOpen={createOpen}
            onCreateOpenChange={setCreateOpen}
            onChange={(cards) =>
              setContent((current) => ({ ...current, cards }))
            }
          />
        </TabsContent>
        <TabsContent value="categories" className="mt-5">
          <ProjectTaxonomyPanel
            categories={content.categories}
            onChange={(categories) =>
              setContent((current) => ({ ...current, categories }))
            }
          />
        </TabsContent>
        <TabsContent value="details" className="mt-5">
          <ProjectDetailEditor
            details={content.details}
            onChange={(details) =>
              setContent((current) => ({ ...current, details }))
            }
          />
        </TabsContent>
        <TabsContent value="related" className="mt-5">
          <RelatedProjectsPanel
            projects={content.related}
            onChange={(related) =>
              setContent((current) => ({ ...current, related }))
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
