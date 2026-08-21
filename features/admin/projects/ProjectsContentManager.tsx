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
import { LockedDesignNotice } from "@/features/admin/components/LockedDesignNotice";
import { ProjectDetailEditor } from "@/features/admin/projects/ProjectDetailEditor";
import { ProjectListPanel } from "@/features/admin/projects/ProjectListPanel";
import { ProjectTaxonomyPanel } from "@/features/admin/projects/ProjectTaxonomyPanel";
import { RelatedProjectsPanel } from "@/features/admin/projects/RelatedProjectsPanel";
import type { ProjectContentBundle } from "@/lib/admin/types/content";
import { Button } from "@/lib/components/ui/button";
import { cn } from "@/lib/utils";

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
        description="Projects Page Cards, Project Detail và Related Projects là ba nhóm dữ liệu độc lập trong prototype này."
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
      <LockedDesignNotice className="mt-6" />

      <div className="admin-scrollbar mt-6 overflow-x-auto">
        <div className="inline-flex min-w-max rounded-xl border bg-card p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
                  active
                    ? "bg-brand/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("size-4", active && "text-brand")}
                  strokeWidth={1.8}
                />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        {activeTab === "list" && (
          <ProjectListPanel
            cards={content.cards}
            categories={content.categories.map((category) => category.label)}
            createOpen={createOpen}
            onCreateOpenChange={setCreateOpen}
            onChange={(cards) =>
              setContent((current) => ({ ...current, cards }))
            }
          />
        )}
        {activeTab === "categories" && (
          <ProjectTaxonomyPanel
            categories={content.categories}
            onChange={(categories) =>
              setContent((current) => ({ ...current, categories }))
            }
          />
        )}
        {activeTab === "details" && (
          <ProjectDetailEditor
            details={content.details}
            onChange={(details) =>
              setContent((current) => ({ ...current, details }))
            }
          />
        )}
        {activeTab === "related" && (
          <RelatedProjectsPanel
            projects={content.related}
            onChange={(related) =>
              setContent((current) => ({ ...current, related }))
            }
          />
        )}
      </div>
    </div>
  );
}
