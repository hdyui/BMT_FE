"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Inbox, LoaderCircle, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/features/admin/components/ui/button";
import { Checkbox } from "@/features/admin/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/admin/components/ui/table";
import {
  deleteFormSubmission,
  listFormSubmissions,
  updateFormSubmissionStatus,
  type FormSubmissionPage,
  type SubmissionStatus,
} from "@/features/admin/services/form-submissions.service";
import { ApiError } from "@/shared/lib/api/errors";

type ReviewFilter = "all" | "reviewed" | "pending";

const PAGE_SIZE = 20;

const statusByFilter: Record<ReviewFilter, SubmissionStatus | undefined> = {
  all: undefined,
  reviewed: "done",
  pending: "pending",
};

function describeError(error: unknown) {
  if (error instanceof ApiError && error.status === 429) {
    return "Thao tác quá nhanh, vui lòng thử lại sau ít phút.";
  }
  return error instanceof Error ? error.message : "Không tải được danh sách liên hệ.";
}

/**
 * Danh sách khách đã gửi form "Liên hệ tư vấn" trên toàn website, lấy từ backend
 * (`GET /admin/form-submissions`). "Đã duyệt" là trạng thái `done` trên backend.
 */
export function ContactSubmissionsPanel() {
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [pageIndex, setPageIndex] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  // Kết quả của lượt tải gần nhất kèm khóa của lượt đó: khóa khác với lượt đang cần
  // nghĩa là đang tải (không phải đặt state đồng bộ trong effect).
  const [loaded, setLoaded] = useState<{
    key: string;
    page?: FormSubmissionPage;
    error?: string;
  } | null>(null);

  const requestKey = `${reviewFilter}|${pageIndex}|${reloadKey}`;

  useEffect(() => {
    let active = true;
    listFormSubmissions({
      pageIndex,
      pageSize: PAGE_SIZE,
      status: statusByFilter[reviewFilter],
    })
      .then((result) => {
        if (!active) return;
        // Xóa hết mục cuối của trang cuối thì lùi về trang trước.
        if (result.items.length === 0 && pageIndex > 1) setPageIndex(pageIndex - 1);
        else setLoaded({ key: requestKey, page: result });
      })
      .catch((loadError) => {
        if (active) setLoaded({ key: requestKey, error: describeError(loadError) });
      });
    return () => {
      active = false;
    };
  }, [pageIndex, reviewFilter, reloadKey, requestKey]);

  const loading = loaded?.key !== requestKey;
  const page = loaded?.page ?? null;
  const error = loading ? null : (loaded?.error ?? null);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  const submissions = page?.items ?? [];

  async function updateReviewed(id: string, reviewed: boolean) {
    try {
      await updateFormSubmissionStatus(id, reviewed ? "done" : "pending");
      reload();
    } catch (updateError) {
      toast.error(describeError(updateError));
    }
  }

  async function removeSubmission(id: string) {
    try {
      await deleteFormSubmission(id);
      reload();
    } catch (deleteError) {
      toast.error(describeError(deleteError));
    }
  }

  function changeFilter(value: ReviewFilter) {
    setReviewFilter(value);
    setPageIndex(1);
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-[0_12px_36px_rgb(36_33_34/.035)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-semibold">Danh sách khách hàng liên hệ</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Tổng hợp thông tin người dùng gửi từ biểu mẫu liên hệ trên toàn bộ website.
          </p>
        </div>
        <span className="rounded-full border px-3 py-1 text-xs font-semibold tabular-nums">
          {page?.totalCount ?? 0} liên hệ
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b px-5 py-3 sm:px-6">
        <span className="mr-1 text-xs font-medium text-muted-foreground">Lọc:</span>
        {(
          [
            ["all", "Tất cả"],
            ["reviewed", "Đã duyệt"],
            ["pending", "Chưa duyệt"],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={reviewFilter === value ? "default" : "outline"}
            className="h-8 rounded-full px-3 text-xs"
            onClick={() => changeFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {error ? (
        <div className="grid min-h-44 place-items-center px-5 py-10 text-center sm:px-6">
          <div>
            <TriangleAlert className="mx-auto size-6 text-destructive" />
            <p className="mt-3 text-sm font-medium">Không tải được danh sách liên hệ</p>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={reload}>
              Thử lại
            </Button>
          </div>
        </div>
      ) : loading && !page ? (
        <div
          role="status"
          className="flex min-h-44 items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <LoaderCircle className="size-4 animate-spin" />
          Đang tải...
        </div>
      ) : submissions.length === 0 ? (
        <div className="grid min-h-44 place-items-center px-5 py-10 text-center sm:px-6">
          <div>
            <span className="mx-auto grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground">
              <Inbox className="size-4" />
            </span>
            <p className="mt-3 text-sm font-medium">Chưa có thông tin liên hệ</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Dữ liệu sẽ xuất hiện tại đây sau khi người dùng gửi biểu mẫu.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table className="min-w-[780px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-5 sm:px-6">Họ tên</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Đã duyệt</TableHead>
                  <TableHead>Thời gian gửi</TableHead>
                  <TableHead className="px-5 text-right sm:px-6">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => {
                  const reviewed = submission.status === "done";
                  return (
                    <TableRow key={submission.id}>
                      <TableCell className="px-5 font-medium sm:px-6">
                        {submission.customerName}
                      </TableCell>
                      <TableCell className="font-medium tabular-nums">{submission.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={reviewed}
                            onCheckedChange={(value) =>
                              void updateReviewed(submission.id, Boolean(value))
                            }
                            aria-label={reviewed ? "Bỏ đánh dấu đã duyệt" : "Đánh dấu đã duyệt"}
                          />
                          <span className="text-xs text-muted-foreground">
                            {reviewed ? "Đã duyệt" : "Chưa duyệt"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatSubmittedAt(submission.createdAt)}
                      </TableCell>
                      <TableCell className="px-5 text-right sm:px-6">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => void removeSubmission(submission.id)}
                        >
                          <Trash2 className="size-4" />
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {page && (page.hasPreviousPage || page.hasNextPage) && (
            <div className="flex items-center justify-between gap-3 border-t px-5 py-3 sm:px-6">
              <span className="text-xs text-muted-foreground tabular-nums">
                Trang {page.pageIndex} / {Math.max(1, Math.ceil(page.totalCount / page.pageSize))}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!page.hasPreviousPage || loading}
                  onClick={() => setPageIndex((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft className="size-4" />
                  Trước
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!page.hasNextPage || loading}
                  onClick={() => setPageIndex((current) => current + 1)}
                >
                  Sau
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function formatSubmittedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
