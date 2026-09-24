"use client";

import { useState, useSyncExternalStore } from "react";
import { Inbox, Trash2 } from "lucide-react";

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
  CONTACT_SUBMISSIONS_CHANGED_EVENT,
  CONTACT_SUBMISSIONS_STORAGE_KEY,
  deleteContactSubmission,
  readContactSubmissions,
  type ContactSubmission,
  updateContactSubmissionReviewed,
} from "@/shared/lib/contact-submissions";

type ReviewFilter = "all" | "reviewed" | "pending";

export function ContactSubmissionsPanel() {
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const submissions = useSyncExternalStore(
    subscribeToContactSubmissions,
    getContactSubmissionsSnapshot,
    getServerContactSubmissionsSnapshot,
  );
  const filteredSubmissions = submissions.filter((submission) => {
    if (reviewFilter === "reviewed") return submission.reviewed;
    if (reviewFilter === "pending") return !submission.reviewed;
    return true;
  });

  function removeSubmission(id: string) {
    deleteContactSubmission(id);
  }

  function updateReviewed(id: string, reviewed: boolean) {
    updateContactSubmissionReviewed(id, reviewed);
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

      {submissions.length === 0 ? (
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
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="px-5 font-medium sm:px-6">
                    {submission.name}
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {submission.phone}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={submission.reviewed}
                        onCheckedChange={(value) =>
                          updateReviewed(submission.id, Boolean(value))
                        }
                        aria-label={
                          submission.reviewed
                            ? "Bỏ đánh dấu đã duyệt"
                            : "Đánh dấu đã duyệt"
                        }
                      />
                      <span className="text-xs text-muted-foreground">
                        {submission.reviewed ? "Đã duyệt" : "Chưa duyệt"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatSubmittedAt(submission.submittedAt)}
                  </TableCell>
                  <TableCell className="px-5 text-right sm:px-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeSubmission(submission.id)}
                    >
                      <Trash2 className="size-4" />
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
          )}
        </>
      )}
    </section>
  );
}

function subscribeToContactSubmissions(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === null ||
      event.key === CONTACT_SUBMISSIONS_STORAGE_KEY
    ) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CONTACT_SUBMISSIONS_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CONTACT_SUBMISSIONS_CHANGED_EVENT, onStoreChange);
  };
}

let cachedRaw: string | null | undefined;
let cachedSubmissions: ContactSubmission[] = [];

function getContactSubmissionsSnapshot() {
  const raw = window.localStorage.getItem(CONTACT_SUBMISSIONS_STORAGE_KEY);
  if (raw === cachedRaw) return cachedSubmissions;

  cachedRaw = raw;
  cachedSubmissions = readContactSubmissions();
  return cachedSubmissions;
}

function getServerContactSubmissionsSnapshot(): ContactSubmission[] {
  return [];
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