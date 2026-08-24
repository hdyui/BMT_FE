import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileImage,
  FolderKanban,
  House,
  Layers3,
  ListTree,
} from "lucide-react";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import type { ProjectContentBundle } from "@/lib/admin/types/content";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const completion = [
  { label: "Trang chủ", value: 82, href: "/admin/content/home" },
  { label: "Giới thiệu", value: 68, href: "/admin/content/about" },
  { label: "Dịch vụ", value: 74, href: "/admin/content/services" },
  { label: "Dự án", value: 76, href: "/admin/projects" },
  { label: "Thông tin chung", value: 54, href: "/admin/settings" },
];

const activities = [
  {
    title: "Phần mở đầu Trang chủ đã được rà soát",
    detail: "4 ảnh có đủ tiêu đề và mô tả hình ảnh",
    time: "12 phút trước",
    done: true,
  },
  {
    title: "Dự án Mộc Miên House",
    detail: "Đang chờ kiểm tra nội dung chi tiết",
    time: "45 phút trước",
    done: false,
  },
  {
    title: "Danh mục dự án",
    detail: "Đã cập nhật nội dung hiển thị",
    time: "Hôm nay, 09:20",
    done: true,
  },
  {
    title: "Cuối trang và mạng xã hội",
    detail: "Cần bổ sung liên kết mạng xã hội",
    time: "Hôm qua, 16:40",
    done: false,
  },
];

export function DashboardView({
  projectContent,
}: {
  projectContent: ProjectContentBundle;
}) {
  const publishedCount = projectContent.cards.filter(
    (project) => project.status === "published",
  ).length;

  const stats = [
    {
      label: "Ảnh mở đầu Trang chủ",
      value: "04",
      detail: "4/4 ảnh đang hiển thị",
      icon: House,
      href: "/admin/content/home",
    },
    {
      label: "Dự án trên Trang chủ",
      value: "32",
      detail: "Dự án nổi bật trên Trang chủ",
      icon: Layers3,
      href: "/admin/content/home",
    },
    {
      label: "Danh sách dự án",
      value: String(projectContent.cards.length).padStart(2, "0"),
      detail: `${publishedCount} nội dung đã xuất bản`,
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      label: "Hồ sơ chi tiết",
      value: String(projectContent.details.length).padStart(2, "0"),
      detail: "Hồ sơ chi tiết của từng dự án",
      icon: ListTree,
      href: "/admin/projects",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Tổng quan"
        description="Theo dõi và cập nhật các nội dung chính trên website BMT Decor."
        actions={
          <Link
            href="/admin/content/home"
            className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}
          >
            <FileImage /> Nội dung Trang chủ
          </Link>
        }
      />

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-[0_12px_36px_rgb(36_33_34/.035)] outline-none transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[0_18px_42px_rgb(36_33_34/.07)] focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-4 text-[32px] font-bold tracking-[-0.05em]">
                    {stat.value}
                  </p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-muted text-brand transition-colors group-hover:bg-brand/10">
                  <Icon className="size-[18px]" strokeWidth={1.75} />
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t pt-3">
                <p className="text-xs text-muted-foreground">{stat.detail}</p>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </div>
              <span className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          );
        })}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.85fr)]">
        <section className="rounded-2xl border bg-card p-5 shadow-[0_12px_36px_rgb(36_33_34/.035)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">Mức độ hoàn thiện nội dung</h2>
              <p className="mt-1 text-xs text-muted-foreground">Theo các nội dung cần hoàn thiện</p>
            </div>
          </div>

          <div className="mt-7 space-y-5">
            {completion.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <Link
                    href={item.href}
                    className="font-medium hover:text-brand hover:underline hover:underline-offset-4"
                  >
                    {item.label}
                  </Link>
                  <span className="tabular-nums text-muted-foreground">
                    {item.value}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-end gap-3 rounded-xl border bg-muted/45 px-4 py-3">
            <Link
              href="/admin/settings"
              className="text-xs font-semibold text-brand hover:underline hover:underline-offset-4"
            >
              Xem cấu hình
            </Link>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border bg-card shadow-[0_12px_36px_rgb(36_33_34/.035)]">
          <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold">Hoạt động gần đây</h2>
              <p className="mt-1 text-xs text-muted-foreground">Các thay đổi nội dung mới nhất</p>
            </div>
            <Clock3 className="size-4 text-muted-foreground" />
          </div>
          <div className="px-5 sm:px-6">
            {activities.map((activity, index) => (
              <div
                key={activity.title}
                className={`flex gap-3 py-4 ${
                  index < activities.length - 1 ? "border-b" : ""
                }`}
              >
                <span
                  className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg ${
                    activity.done
                      ? "bg-brand/10 text-brand"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {activity.done ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <Clock3 className="size-3.5" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {activity.detail}
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground/80">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 overflow-hidden rounded-2xl border bg-card shadow-[0_12px_36px_rgb(36_33_34/.035)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold">Nội dung dự án gần đây</h2>
            <p className="mt-1 text-xs text-muted-foreground">Các dự án vừa được thêm hoặc cập nhật</p>
          </div>
          <Link
            href="/admin/projects"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Xem tất cả <ArrowUpRight />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead className="px-5 sm:px-6">Dự án</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="px-5 text-right sm:px-6">Ngày tạo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectContent.cards.slice(0, 5).map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="px-5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={project.thumbnail}
                          alt={project.imageAlt}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{project.title}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.category}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        project.status === "published" ? "success" : "warning"
                      }
                    >
                      {project.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 text-right tabular-nums text-muted-foreground sm:px-6">
                    {project.createdAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
