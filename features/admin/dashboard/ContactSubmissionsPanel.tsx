"use client";

import { useEffect, useState } from "react";
import { Inbox, Loader2, Trash2 } from "lucide-react";
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
import { formSubmissionsApiClient } from "@/features/admin/services/form-submissions-api.client";
import type { FormSubmissionItem } from "@/features/admin/services/catalog-api.types";

type ReviewFilter = "all" | "reviewed" | "pending";

export function ContactSubmissionsPanel() {
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [submissions, setSubmissions] = useState<FormSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    void formSubmissionsApiClient
      .getList()
      .then((page) => {
        if (!active) return;
        setSubmissions(page.items);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải danh sách liên hệ.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  function retryLoadSubmissions() {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }

  function markPending(id: string, value: boolean) {
    setPendingIds((current) => {
      const next = new Set(current);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const filteredSubmissions = submissions.filter((submission) => {
    if (reviewFilter === "reviewed") return submission.status === "done";
    if (reviewFilter === "pending") return submission.status === "pending";
    return true;
  });

  async function removeSubmission(id: string) {
    markPending(id, true);
    try {
      await formSubmissionsApiClient.remove(id);
      setSubmissions((current) => current.filter((item) => item.id !== id));
      toast.success("Đã xóa thông tin liên hệ.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Xóa liên hệ chưa thành công.",
      );
    } finally {
      markPending(id, false);
    }
  }

  async function updateReviewed(id: string, reviewed: boolean) {
    const nextStatus = reviewed ? "done" : "pending";
    markPending(id, true);
    try {
      const updated = await formSubmissionsApiClient.updateStatus(
        id,
        nextStatus,
      );
      setSubmissions((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Cập nhật trạng thái chưa thành công.",
      );
    } finally {
      markPending(id, false);
    }
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
          {submissions.length} liên hệ
        </span>
      </div>

      {loading ? (
        <div className="grid min-h-44 place-items-center px-5 py-10 text-center sm:px-6">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="grid min-h-44 place-items-center px-5 py-10 text-center sm:px-6">
          <div>
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={retryLoadSubmissions}
            >
              Thử lại
            </Button>
          </div>
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
          <div className="flex flex-wrap items-center gap-2 border-b px-5 py-3 sm:px-6">
            <span className="mr-1 text-xs font-medium text-muted-foreground">
              Lọc:
            </span>
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
                onClick={() => setReviewFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="grid min-h-36 place-items-center px-5 py-8 text-center sm:px-6">
              <div>
                <Inbox className="mx-auto size-5 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">
                  Không có liên hệ phù hợp
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Thử chọn bộ lọc khác để xem danh sách.
                </p>
              </div>
            </div>
          ) : (
          <div className="overflow-x-auto">
          <Table className="min-w-[780px]">
            <TableHeader>
              <TableRow>
                <TableHead className="px-5 sm:px-6">Họ tên</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Đã duyệt</TableHead>
                <TableHead>Thời gian gửi</TableHead>
                <TableHead className="px-5 text-right sm:px-6">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => {
                const isPending = pendingIds.has(submission.id);
                const reviewed = submission.status === "done";
                return (
                <TableRow key={submission.id}>
                  <TableCell className="px-5 font-medium sm:px-6">
                    {submission.customerName}
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {submission.phone}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={reviewed}
                        disabled={isPending}
                        onCheckedChange={(value) =>
                          void updateReviewed(submission.id, Boolean(value))
                        }
                        aria-label={
                          reviewed
                            ? "Bỏ đánh dấu đã duyệt"
                            : "Đánh dấu đã duyệt"
                        }
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
                      disabled={isPending}
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
